export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super('Max number of checkin-ins reached.')
  }
}
