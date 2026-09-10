export interface ProblemField {
  field: string
  code: string
}

export class ApiProblem extends Error {
  readonly status: number
  readonly code: string
  readonly type: string
  readonly fields: ProblemField[] | undefined

  constructor(status: number, code: string, message: string, fields?: ProblemField[]) {
    super(message)
    this.name = 'ApiProblem'
    this.status = status
    this.code = code
    this.type = `https://klyrow.com/problems/${code.toLowerCase().replaceAll('_', '-')}`
    this.fields = fields
  }
}

export const validationProblem = (fields: ProblemField[]) => new ApiProblem(422, 'VALIDATION_ERROR', 'Review the highlighted fields.', fields)
