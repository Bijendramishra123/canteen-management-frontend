import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { menuApi } from '../../api/endpoints/menu'

export const useFoods = (params) => {
  return useQuery({
    queryKey: ['foods', params],
    queryFn: () => menuApi.getFoods(params).then(res => res.data),
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateFood = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: menuApi.createFood,
    onSuccess: () => {
      queryClient.invalidateQueries(['foods'])
      toast.success('Food item created successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to create food item')
    },
  })
}

export const useDeleteFood = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: menuApi.deleteFood,
    onSuccess: () => {
      queryClient.invalidateQueries(['foods'])
      toast.success('Food item deleted successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to delete food item')
    },
  })
}
