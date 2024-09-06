-- CreateTable
CREATE TABLE "user" (
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "category" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'income'
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'income',
    "file_path" TEXT,
    "file_name" TEXT,
    "category" TEXT NOT NULL,
    "categoryIcon" TEXT NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "month_history" (
    "userId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "income" DOUBLE PRECISION NOT NULL,
    "expense" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "month_history_pkey" PRIMARY KEY ("day","month","year","userId")
);

-- CreateTable
CREATE TABLE "year_history" (
    "userId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "income" DOUBLE PRECISION NOT NULL,
    "expense" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "year_history_pkey" PRIMARY KEY ("month","year","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_userId_type_key" ON "category"("name", "userId", "type");
