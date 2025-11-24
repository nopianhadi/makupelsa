import { supabase, isMockMode } from '../lib/supabase';
import { mockAuthService } from './mockAuthService';

export const authService = {
    async getSession() {
        if (isMockMode) {
            return mockAuthService.getSession();
        }
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    },

    async getUserProfile(userId) {
        if (isMockMode) {
            return mockAuthService.getUserProfile(userId);
        }
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    async updateProfile(userId, updates) {
        if (isMockMode) {
            return mockAuthService.updateProfile(userId, updates);
        }
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async signUp(email, password, metadata) {
        if (isMockMode) {
            return mockAuthService.signUp(email, password, metadata);
        }
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });
        if (error) throw error;
        return data;
    },

    async signIn(email, password) {
        if (isMockMode) {
            return mockAuthService.signIn(email, password);
        }
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    async signOut() {
        if (isMockMode) {
            return mockAuthService.signOut();
        }
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async resetPassword(email) {
        if (isMockMode) {
            return mockAuthService.resetPassword(email);
        }
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
    }
};
