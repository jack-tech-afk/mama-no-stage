import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    stage: z.enum([
      'trying',       // 妊活
      'trimester-1',  // 妊娠初期（〜15週）
      'trimester-2',  // 妊娠中期（16〜27週）
      'trimester-3',  // 妊娠後期（28週〜出産）
      'newborn',      // 新生児（0〜3ヶ月）
      'infant',       // 乳児後半（4〜11ヶ月）
      'age-1',        // 1歳
      'age-2',        // 2歳
      'age-3',        // 3歳
      'preschool',    // 4〜6歳
      'elementary',   // 小学生
    ]),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    affiliate: z.array(z.object({
      name: z.string(),
      url: z.string(),
      price: z.string().optional(),
      description: z.string(),
    })).default([]),
  }),
});

export const collections = { blog };
