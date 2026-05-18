/**
 * Seed inicial do banco Supabase.
 *
 * Pré-requisitos:
 *   1. Execute supabase/schema.sql no SQL Editor do Supabase.
 *   2. Defina no arquivo .env (ou ambiente) as variáveis:
 *        VITE_SUPABASE_URL          (URL do projeto Supabase)
 *        SUPABASE_SERVICE_ROLE_KEY  (Service Role Key — NÃO commitar)
 *
 * Execução:
 *   npm run seed
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { initialProjects, initialContent } from "../src/data/projects";
import { initialNews } from "../src/data/news";

config();

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Faltam VITE_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY no .env");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seedProjects() {
  const rows = initialProjects.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    year: p.year,
    location: p.location,
    area: p.area,
    description: p.description,
    cover: p.cover,
    gallery: p.gallery,
  }));
  const { error } = await supabase.from("projects").upsert(rows, { onConflict: "id" });
  if (error) throw error;
  console.log(`✔ Projects seeded (${rows.length})`);
}

async function seedNews() {
  const rows = initialNews.map((n) => ({
    id: n.id,
    title: n.title,
    excerpt: n.excerpt,
    content: n.content,
    cover: n.cover,
    category: n.category,
    author: n.author,
    date: n.date,
    sources: n.sources ?? [],
  }));
  const { error } = await supabase.from("news").upsert(rows, { onConflict: "id" });
  if (error) throw error;
  console.log(`✔ News seeded (${rows.length})`);
}

async function seedContent() {
  const { error } = await supabase
    .from("site_content")
    .upsert({ id: "main", data: initialContent }, { onConflict: "id" });
  if (error) throw error;
  console.log("✔ Site content seeded");
}

async function main() {
  await seedProjects();
  await seedNews();
  await seedContent();
  console.log("\nSeed concluído.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
