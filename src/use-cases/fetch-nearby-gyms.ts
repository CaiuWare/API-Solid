import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude: userlatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userlatitude,
      longitude: userLongitude,
    })
    return { gyms }
  }
}
