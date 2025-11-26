import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  /**
   * Login endpoint
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    // Vérifier que l'email et le mot de passe sont fournis
    if (!email || !password) {
      return response.badRequest({
        error: 'Email et mot de passe requis'
      })
    }

    // Chercher l'utilisateur par email
    const user = await User.findBy('email', email)

    if (!user) {
      return response.unauthorized({
        error: 'Email ou mot de passe incorrect'
      })
    }

    // Vérifier le mot de passe
    const isPasswordValid = await hash.verify(user.password, password)

    if (!isPasswordValid) {
      return response.unauthorized({
        error: 'Email ou mot de passe incorrect'
      })
    }

    // Créer un token d'accès
    const token = await User.accessTokens.create(user)

    return response.ok({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      },
      token: token.value!.release()
    })
  }

  /**
   * Logout endpoint
   */
  async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.ok({
      message: 'Déconnexion réussie'
    })
  }

  /**
   * Get current user
   */
  async me({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()

    return response.ok({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      }
    })
  }
}