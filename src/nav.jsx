import { createContext, useContext, useState } from 'react'

const NavCtx = createContext(null)

export function NavProvider({ children }) {
  const [stack, setStack] = useState([{ name: 'objevuj', params: {} }])

  const nav = {
    stack,
    cur: stack[stack.length - 1],
    push(name, params = {}) {
      setStack((st) => [...st, { name, params }])
    },
    pop() {
      setStack((st) => (st.length > 1 ? st.slice(0, -1) : st))
    },
    tab(name) {
      setStack([{ name, params: {} }])
    },
    replace(name, params = {}) {
      setStack((st) => [...st.slice(0, -1), { name, params }])
    },
  }

  return <NavCtx.Provider value={nav}>{children}</NavCtx.Provider>
}

export function useNav() {
  return useContext(NavCtx)
}
