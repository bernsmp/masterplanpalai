import { NextRequest } from 'next/server'

export function verifyPassword(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const password = process.env.NEXT_PUBLIC_APP_PASSWORD
  
  if (!password) {
    return false
  }
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  
  const token = authHeader.substring(7)
  return token === password
}

export function createAuthHeaders(password: string) {
  return {
    'Authorization': `Bearer ${password}`,
    'Content-Type': 'application/json'
  }
}
