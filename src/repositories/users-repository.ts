import { Prisma, User } from '@prisma/client'

export interface UsersRepositpry {
  findByEmail(email: string): Promise<User | null>

  create(data: Prisma.UserCreateInput): Promise<User>
}
