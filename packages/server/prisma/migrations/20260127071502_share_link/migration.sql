-- CreateTable
CREATE TABLE "share_links" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "share_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "share_links_code_key" ON "share_links"("code");

-- CreateIndex
CREATE UNIQUE INDEX "share_links_fileId_key" ON "share_links"("fileId");

-- AddForeignKey
ALTER TABLE "share_links" ADD CONSTRAINT "share_links_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "dot_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
