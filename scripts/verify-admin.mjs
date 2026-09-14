import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import bcrypt from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing.");
}

const email =
  process.env.ADMIN_EMAIL?.trim().toLowerCase() ||
  "support@edgeportfoliomarket.com";

const password = process.env.ADMIN_PASSWORD;

if (!password) {
  throw new Error("ADMIN_PASSWORD is missing.");
}

const pool = new Pool({
  connectionString: databaseUrl,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      passwordHash: true,
      role: true,
      status: true,
      emailVerified: true,
    },
  });

  console.log("");

  if (!user) {
    console.log("? Admin user was not found.");
    console.log("");
    console.log(`Checked email: ${email}`);
    console.log("");
    return;
  }

  const passwordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  console.log("======================================");
  console.log("       Edge Portfolio ADMIN CHECK");
  console.log("======================================");
  console.log("");

  console.log(
    `Name:       ${user.firstName} ${user.lastName}`
  );

  console.log(
    `Email:      ${user.email}`
  );

  console.log(
    `Role:       ${user.role}`
  );

  console.log(
    `Status:     ${user.status}`
  );

  console.log(
    `Verified:   ${user.emailVerified ? "YES" : "NO"}`
  );

  console.log(
    `Password:   ${passwordValid ? "MATCH" : "DOES NOT MATCH"}`
  );

  console.log("");

  if (
    passwordValid &&
    user.role === "ADMIN" &&
    user.status === "ACTIVE" &&
    user.emailVerified
  ) {
    console.log(
      "? Admin account verification passed."
    );

    console.log(
      "? Email, password, role, status, and verification are correct."
    );
  } else {
    console.log(
      "? Admin account verification failed."
    );
  }

  console.log("");
}

main()
  .catch((error) => {
    console.error("");
    console.error("? Admin check failed:");
    console.error(error);
    console.error("");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
