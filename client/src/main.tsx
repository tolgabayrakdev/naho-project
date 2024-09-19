import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import routes from './routes'
import { ChakraProvider } from '@chakra-ui/react'
import { Suspense } from 'react'
import Loading from './components/loading'

createRoot(document.getElementById('root')!).render(
  <ChakraProvider>
    <Suspense fallback={<Loading />}>
      <RouterProvider router={routes} />
    </Suspense>
  </ChakraProvider>
)
