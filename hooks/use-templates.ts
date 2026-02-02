import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { templateService } from "@/services/template-service";
import { UseTemplatePayload, UseRealDataResponse } from "@/types/template";

export const useTemplates = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: () => templateService.getTemplates(),
  });
};

export const useUseTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UseTemplatePayload) =>
      templateService.useTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
};

import { toast } from "sonner";

export const useUseRealData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => templateService.useRealData(),
    onSuccess: (data: unknown) => {
      const response = data as UseRealDataResponse;
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success(
        response?.message || "Success: Use real data request sent!",
      );
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Please login again!",
      );
    },
  });
};
