import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  const password = await bcrypt.hash(process.env.SEED_PASSWORD!, 10);

  const authors = [];
  const names = [
    ["Ada", "Stone"],
    ["Liam", "Cole"],
    ["Maya", "Reed"],
    ["Noah", "Grant"],
    ["Sophia", "Lane"],
    ["Ethan", "Brooks"],
    ["Grace", "Turner"],
    ["Lucas", "Hall"],
    ["Chloe", "Price"],
    ["Daniel", "King"],
    ["Zoe", "Young"],
    ["Isaac", "Moore"]
  ];

  for (const [i, n] of names.entries()) {
    const u = await prisma.user.upsert({
      where: { username: (`${n[0]}${n[1]}`).toLowerCase() },
      update: {},
      create: {
        firstName: n[0] || '',
        lastName: n[1] ||  '',
        username: (`${n[0]}${n[1]}`).toLowerCase(),
        password
      }
    });
    authors.push(u);
  }

  const topics = [
    "React Performance",
    "TypeScript Tips",
    "Express Security",
    "Prisma ORM",
    "PostgreSQL Indexes",
    "REST API Design",
    "JWT Authentication",
    "Docker Basics",
    "Testing Node Apps",
    "Modern CSS",
    "JavaScript Closures",
    "Frontend Architecture",
    "Caching Strategies",
    "Accessibility",
    "React Router",
    "TinyMCE Guide",
    "Cloudinary Uploads",
    "Error Handling",
    "Web Performance",
    "Clean Code"
  ];

  for (let i = 0; i < 20; i++) {
    const post = await prisma.post.upsert({
      where: { id: `post-${i}` },
      update: {},
      create: {
        id: `post-${i}`,
        title: topics[i] || "",
        subtitle: "A practical guide for modern developers",
        hero_img_url:
          [
            "https://res.cloudinary.com/dikpfkrli/image/upload/v1780727718/cld-sample-3.jpg",
            "https://res.cloudinary.com/dikpfkrli/image/upload/v1782911336/drive/fufxhg07xsa7v9gk4gio.jpg",
            "https://res.cloudinary.com/dikpfkrli/image/upload/v1782569039/drive/wll2mqnawkpmmuhjtdor.jpg",
            "https://res.cloudinary.com/dikpfkrli/image/upload/v1783271355/drive/pypxy0ro2hztwyy9h306.png",
            "https://res.cloudinary.com/dikpfkrli/image/upload/v1780800530/drive/hgxixpqibs2bkln6fwzt.jpg",
            "https://res.cloudinary.com/dikpfkrli/image/upload/v1783078427/drive/sgy7nxkzfkjtmncok1g0.svg",
            "https://res.cloudinary.com/dikpfkrli/image/upload/v1780797291/drive/fxc1fr06lg3kdsigecwa.png"
          ][i % 7] || "",
        published: true,
        authorId: authors[i % authors.length]?.id || "",
        content: `
        <h2>${topics[i]}</h2>
        <p>This article explores practical techniques used in production applications.</p>
        <p>Focus on readability, testing, scalability, and performance.</p>
        <ul><li>Real-world advice</li><li>Common mistakes</li><li>Best practices</li></ul>
        <blockquote>Write code for humans first, computers second.</blockquote>
        <pre class="language-javascript"><code>function greet(name){
          return "Hello " + name;
        }
        console.log(greet("Developer"));</code></pre>
        <p>Always measure performance before optimizing.</p>
        `
      }
    });

    for (let l = 0; l < Math.floor(Math.random() * 40) + 5; l++) {
      await prisma.postLike.create({ data: { postId: post.id } });
    }

    const commentCount = Math.floor(Math.random() * 8);
    for (let c = 0; c < commentCount; c++) {
      const comment = await prisma.comment.create({
        data: {
          username: `reader${i}_${c}`,
          content: [
            "Excellent explanation!",
            "This solved my problem.",
            "Could you cover this in more depth?",
            "Very practical article.",
            "Bookmarked for later."
          ][c % 5] || '',
          postId: post.id
        }
      });

      for (let k = 0; k < Math.floor(Math.random() * 6); k++) {
        await prisma.commentLike.create({ data: { commentId: comment.id } });
      }
    }
  }

  console.log("Seed complete");
}

main().finally(() => prisma.$disconnect());
