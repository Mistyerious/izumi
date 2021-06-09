-- CreateTable
CREATE TABLE "warns" (
    "id" VARCHAR(255) NOT NULL,
    "caseId" TEXT NOT NULL,
    "moderator" VARCHAR(22) NOT NULL,
    "reason" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,

    PRIMARY KEY ("id")
);
