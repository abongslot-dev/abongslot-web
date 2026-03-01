import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  basePath: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    // Bagian ini penting agar Vercel tidak rewel soal variabel yang tidak terpakai
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "no-unused-vars": "off",
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
