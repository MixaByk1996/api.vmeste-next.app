-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "answerId" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
