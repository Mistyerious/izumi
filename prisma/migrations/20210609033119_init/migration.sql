-- CreateTable
CREATE TABLE "settings" (
    "id" VARCHAR(255) NOT NULL,
    "data" TEXT NOT NULL DEFAULT E'{}',

    PRIMARY KEY ("id")
);
