import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request) {
  let conn;
  try {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target');
    conn = await db();

    if (target === 'members') {
      const [rows] = await conn.execute('SELECT * FROM members ORDER BY id DESC');
      return NextResponse.json(rows);
    }

    if (target === 'deposits-pending') {
      const [rows] = await conn.execute(
        "SELECT * FROM deposits WHERE status = 'pending' ORDER BY created_at DESC"
      );
      return NextResponse.json(rows);
    }

    // --- PERBAIKAN 1: Ambil SEMUA yang sudah diproses (biar gak hilang) ---
    if (target === 'deposits-history') {
      const [rows] = await conn.execute(
        `SELECT * FROM deposits 
         WHERE status != 'pending' 
         ORDER BY created_at DESC`
      );
      
      const cleanedData = rows.map(row => ({
        ...row,
        nominal: row.nominal || row.amount || 0,
        bonus: row.bonus || 0,
        total_deposit: Number(row.nominal || row.amount || 0) + Number(row.bonus || 0)
      }));

      return NextResponse.json(cleanedData);
    }

    return NextResponse.json({ error: "Target tidak valid" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}

// --- PERBAIKAN 2: Logic PATCH yang Pintar ---
export async function PATCH(request) {
  let conn;
  try {
    const body = await request.json();
    
    // 1. Ambil ID & Nominal (Kita cek dua-duanya biar aman)
    const tId = body.transactionId || body.id;
    const tNominal = body.amount || body.nominal; 
    const { username, status } = body;

    if (!tId) return NextResponse.json({ success: false, error: "ID Kosong" });

    conn = await db();

    // 2. Tentukan status akhir
    const isMenerima = status === 'SUCCESS' || status === 'APPROVE';
    const finalStatus = isMenerima ? 'SUCCESS' : 'REJECTED';

    // 3. Update Status Deposit
    const [result] = await conn.execute(
      "UPDATE deposits SET status = ? WHERE id = ?",
      [finalStatus, tId]
    );

    // 4. Update Saldo Member (Hanya jika SUCCESS)
    if (finalStatus === 'SUCCESS' && result.affectedRows > 0) {
      await conn.execute(
        "UPDATE members SET saldo = saldo + ? WHERE username = ?",
        [Number(tNominal), username]
      );
    }

    return NextResponse.json({ success: true, message: `Berhasil di-${finalStatus}` });

  } catch (error) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (conn) await conn.end();
  }
}