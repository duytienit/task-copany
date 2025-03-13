
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface UsersState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Loading states
    fetchUsersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.isLoading = false;
      state.users = action.payload;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // User selection
    selectUser: (state, action: PayloadAction<string>) => {
      state.selectedUser = state.users.find(user => user.id === action.payload) || null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    
    // User management
    inviteUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    updateUserRole: (state, action: PayloadAction<{ userId: string; role: string }>) => {
      const { userId, role } = action.payload;
      const user = state.users.find(user => user.id === userId);
      if (user) {
        user.role = role;
      }
    },
  },
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  selectUser,
  clearSelectedUser,
  inviteUser,
  updateUser,
  deleteUser,
  updateUserRole,
} = usersSlice.actions;

export default usersSlice.reducer;
