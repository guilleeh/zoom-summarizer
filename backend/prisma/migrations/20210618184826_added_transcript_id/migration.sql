/*
  Warnings:

  - Added the required column `transcriptId` to the `Recording` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recording" ADD COLUMN     "transcriptId" TEXT NOT NULL;
