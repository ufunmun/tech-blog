// ログインAPI用のエンドポイントを作成
import { defineEventHandler, readBody } from 'h3'
import { supabase } from '../../config/supabase'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: body.email,
            password: body.password
        })

        if (error) throw error

        return {
            user: data.user,
            session: data.session
        }
    } catch (error) {
        return {
            statusCode: 400,
            message: "Login failed",
            error: error instanceof Error ? error.message : "Unknown error"
        }
    }
})