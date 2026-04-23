const BASE_URL = 'https://api.bukuacak.shabsolute.tech/api/v1/book'

export const getbooks = async () => {
    try {
        const response = await fetch(BASE_URL)
        if (!response.ok) {
            throw new Error('Failed to fetch books')
        }
        const books = await response.json()
        return books
    } catch (error) {
        console.error('Error fetching books:', error)
        throw error
    }
}

export const getbookById = async (id: string) => {
    try {
        const response = await fetch(`${BASE_URL}?_id=${id}`, {
      cache: "no-store",
    });
        if (!response.ok) {
            throw new Error(`Failed to fetch book with id ${id}`)
        }
        const book = await response.json()
        return book

    } catch (error) {
        console.error('Error fetching book by ID:', error)
        throw error
    }
}