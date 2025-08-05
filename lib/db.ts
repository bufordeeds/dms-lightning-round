import { supabase } from './supabase';
import { Employee, Session, Answer } from './types/database';

export const employeeDb = {
  async getAll() {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async create(name: string) {
    const { data, error } = await supabase
      .from('employees')
      .insert({ name })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, name: string) {
    const { data, error } = await supabase
      .from('employees')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const sessionDb = {
  async getAll() {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        answers (
          *,
          employee:employees (*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        answers (
          *,
          employee:employees (*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(question: string, asked_by?: string) {
    const { data, error } = await supabase
      .from('sessions')
      .insert({ question, asked_by })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async complete(id: string) {
    const { data, error } = await supabase
      .from('sessions')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const answerDb = {
  async create(session_id: string, employee_id: string, answer: string | null) {
    const { data, error } = await supabase
      .from('answers')
      .insert({ session_id, employee_id, answer })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async createBatch(answers: Array<{
    session_id: string;
    employee_id: string;
    answer: string | null;
  }>) {
    const { data, error } = await supabase
      .from('answers')
      .insert(answers)
      .select();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, answer: string | null) {
    const { data, error } = await supabase
      .from('answers')
      .update({ answer })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};