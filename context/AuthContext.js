import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  
  // Start with an empty array of properties
  const [properties, setProperties] = useState([]);

  const seedProperties = [
    {
      id: 'seed-1',
      title: "The Obsidian Glass Villa",
      location: "Beverly Hills, CA",
      price: "$12,500,000",
      beds: 5,
      baths: 6.5,
      sqft: "7,200",
      description: "Experience unparalleled luxury in this architecturally significant glass villa. Featuring floor-to-ceiling windows and a private infinity pool.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 'seed-2',
      title: "Azure Horizon Penthouse",
      location: "Miami, FL",
      price: "$8,900,000",
      beds: 3,
      baths: 4,
      sqft: "4,500",
      description: "A breathtaking sky-residence with 360-degree ocean views, custom Italian finishes, and a sprawling terrace.",
      image: "https://images.unsplash.com/photo-1600607687931-cebf698d2548?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 'seed-3',
      title: "The Emerald Forest Retreat",
      location: "Aspen, CO",
      price: "$15,200,000",
      beds: 6,
      baths: 7.5,
      sqft: "9,800",
      description: "A modern-industrial mountain estate nestled in old-growth evergreens, featuring a full-service spa and heated indoor/outdoor lap pool.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  // Check valid session on mount
  useEffect(() => {
    const session = localStorage.getItem('flowestate_session');
    if (session) {
      try {
        const storedUser = JSON.parse(session);
        setUser(storedUser);
      } catch (e) {
        console.error('Failed to parse session');
      }
    }
    
    // Load properties from Supabase
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        // Fallback to seed properties if table is empty or error occurs
        setProperties(seedProperties);
      } else if (data && data.length > 0) {
        setProperties(data);
      } else {
        setProperties(seedProperties);
      }
    };

    fetchProperties();

    // Load theme
    const storedTheme = localStorage.getItem('flowestate_theme') || 'dark';
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('flowestate_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const login = (email, role) => {
    const newUser = { email, role };
    setUser(newUser);
    localStorage.setItem('flowestate_session', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('flowestate_session');
  };

  const addProperty = async (propertyData) => {
    const { data, error } = await supabase
      .from('properties')
      .insert([{
        ...propertyData,
        user_email: user?.email || 'anonymous'
      }])
      .select();

    if (error) {
      console.error('Error adding property:', error);
      return;
    }

    if (data) {
      setProperties([...properties, data[0]]);
    }
  };

  const removeProperty = async (id) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing property:', error);
      return;
    }

    setProperties(properties.filter(p => p.id !== id));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, properties, addProperty, removeProperty, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
