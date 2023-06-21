export interface Document {
  id: string
  title: string
  content?: string
}

/* Requests */

export namespace DocumentRequest {
  export type Save = Document

  export type Fetch = {
    id: string
  }

  export type Delete = {
    id: string
  }
}

/* Response */

export namespace DocumentResponse {
  export type FetchAll = {
    data: Document[]
  }

  export type Fetch = {
    data: Document
  }

  export type Create = {
    data: Document
  }
}
