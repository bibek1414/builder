import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { templateService } from "@/services/template-service";
import { UseTemplatePayload } from "@/types/template";

export const useTemplates = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: () => templateService.getTemplates(),
  });
};

export const useUseTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UseTemplatePayload) => templateService.useTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
};

export const useUseRealData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => templateService.useRealData(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
};
