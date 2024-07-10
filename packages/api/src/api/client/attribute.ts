import { type TAttributeUpdateInput } from "@formbricks/types/attributes";
import { type Result } from "@formbricks/types/errorHandlers";
import { type NetworkError } from "@formbricks/types/errors";
import { makeRequest } from "../../utils/make-request";

export class AttributeAPI {
  private apiHost: string;
  private environmentId: string;

  constructor(apiHost: string, environmentId: string) {
    this.apiHost = apiHost;
    this.environmentId = environmentId;
  }

  async update(
    attributeUpdateInput: Omit<TAttributeUpdateInput, "environmentId">
  ): Promise<Result<{ changed: boolean; message: string }, NetworkError | Error>> {
    // transform all attributes to string if attributes are present into a new attributes copy
    const attributes: Record<string, string> = {};
    for (const key in attributeUpdateInput.attributes) {
      attributes[key] = String(attributeUpdateInput.attributes[key]);
    }

    return makeRequest(
      this.apiHost,
      `/api/v1/client/${this.environmentId}/people/${attributeUpdateInput.userId}/attributes`,
      "PUT",
      { attributes }
    );
  }
}
