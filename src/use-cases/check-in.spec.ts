import { expect, describe, it, beforeEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/im-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymRepository)

    await gymRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      latitude: -23.6158976,
      longitude: -46.6354176,
      phone: '',
    })
  })
  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user 01',
      userLatitude: -23.6158976,
      userLongitude: -46.6354176,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user 01',
      userLatitude: -23.6158976,
      userLongitude: -46.6354176,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user 01',
        userLatitude: -23.6158976,
        userLongitude: -46.6354176,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })
  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user 01',
      userLatitude: -23.6158976,
      userLongitude: -46.6354176,
    })

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user 01',
      userLatitude: -23.6158976,
      userLongitude: -46.6354176,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in on distant gym', async () => {
    gymRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      latitude: new Decimal(28.4811732),
      longitude: new Decimal(-81.3426652),
      phone: '',
    })

    // 28.4811732,-81.3426652

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user 01',
        userLatitude: -23.6158976,
        userLongitude: -46.6354176,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
