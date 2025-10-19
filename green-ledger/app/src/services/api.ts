import { CarbonEntry, CarbonSummary } from '../types';

// Use your computer's IP address for mobile testing
// Or 'http://localhost:8080' for emulator
const API_BASE_URL = 'http://192.168.1.100:8080/api'; // Replace with your computer's IP

export const carbonApi = {
  getEntries: async (): Promise<CarbonEntry[]> => {
    try {
      console.log('Fetching entries from:', `${API_BASE_URL}/carbon-entries`);
      const response = await fetch(`${API_BASE_URL}/carbon-entries`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Entries fetched:', data);
      return data;
    } catch (error) {
      console.error('Error fetching entries:', error);
      throw new Error('Failed to fetch entries from server');
    }
  },

  createEntry: async (entry: Omit<CarbonEntry, 'id'>): Promise<CarbonEntry> => {
    try {
      console.log('Creating entry:', entry);
      const response = await fetch(`${API_BASE_URL}/carbon-entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Entry created:', data);
      return data;
    } catch (error) {
      console.error('Error creating entry:', error);
      throw new Error('Failed to create entry on server');
    }
  },

  getSummary: async (): Promise<CarbonSummary> => {
    try {
      console.log('Fetching summary from:', `${API_BASE_URL}/carbon-entries/summary`);
      const response = await fetch(`${API_BASE_URL}/carbon-entries/summary`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Summary fetched:', data);
      return data;
    } catch (error) {
      console.error('Error fetching summary:', error);
      throw new Error('Failed to fetch summary from server');
    }
  },

  updateEntry: async (id: number, entry: Partial<CarbonEntry>): Promise<CarbonEntry> => {
    try {
      const response = await fetch(`${API_BASE_URL}/carbon-entries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating entry:', error);
      throw new Error('Failed to update entry on server');
    }
  },

  deleteEntry: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/carbon-entries/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw new Error('Failed to delete entry on server');
    }
  },
};