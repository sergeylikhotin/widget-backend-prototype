-- AlterTable
ALTER TABLE "CaslAbility" ALTER COLUMN "role" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activationCodeExpiration" TIMESTAMP(3);
