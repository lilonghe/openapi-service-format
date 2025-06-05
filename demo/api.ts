/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Order {
  /**
   * @format int64
   * @example 10
   */
  id?: number;
  /**
   * @format int64
   * @example 198772
   */
  petId?: number;
  /**
   * @format int32
   * @example 7
   */
  quantity?: number;
  /** @format date-time */
  shipDate?: string;
  /**
   * Order Status
   * @example "approved"
   */
  status?: "placed" | "approved" | "delivered";
  complete?: boolean;
}

export interface Category {
  /**
   * @format int64
   * @example 1
   */
  id?: number;
  /** @example "Dogs" */
  name?: string;
}

export interface User {
  /**
   * @format int64
   * @example 10
   */
  id?: number;
  /** @example "theUser" */
  username?: string;
  /** @example "John" */
  firstName?: string;
  /** @example "James" */
  lastName?: string;
  /** @example "john@email.com" */
  email?: string;
  /** @example "12345" */
  password?: string;
  /** @example "12345" */
  phone?: string;
  /**
   * User Status
   * @format int32
   * @example 1
   */
  userStatus?: number;
}

export interface Tag {
  /** @format int64 */
  id?: number;
  name?: string;
}

export interface Pet {
  /**
   * @format int64
   * @example 10
   */
  id?: number;
  /** @example "doggie" */
  name: string;
  category?: Category;
  photoUrls: string[];
  tags?: Tag[];
  /** pet status in the store */
  status?: "available" | "pending" | "sold";
}

export interface ApiResponse {
  /** @format int32 */
  code?: number;
  type?: string;
  message?: string;
}

export interface Error {
  code: string;
  message: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "https://petstore3.swagger.io/api/v3",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then((response) => response.data);
  };
}

/**
 * @title Swagger Petstore - OpenAPI 3.0
 * @version 1.0.12
 * @license Apache 2.0 (https://www.apache.org/licenses/LICENSE-2.0.html)
 * @termsOfService https://swagger.io/terms/
 * @baseUrl https://petstore3.swagger.io/api/v3
 * @externalDocs https://swagger.io
 * @contact <apiteam@swagger.io>
 *
 * This is a sample Pet Store Server based on the OpenAPI 3.0 specification.  You can find out more about
 * Swagger at [https://swagger.io](https://swagger.io). In the third iteration of the pet store, we've switched to the design first approach!
 * You can now help us improve the API whether it's by making changes to the definition itself or to the code.
 * That way, with time, we can improve the API in general, and expose some of the new features in OAS3.
 *
 * Some useful links:
 * - [The Pet Store repository](https://github.com/swagger-api/swagger-petstore)
 * - [The source API definition for the Pet Store](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  pet = {
    /**
     * @description Update an existing pet by Id.
     *
     * @tags pet
     * @name UpdatePet
     * @summary Update an existing pet.
     * @request PUT:/pet
     * @secure
     */
    updatePet: (data: Pet, params: RequestParams = {}) =>
      this.request<Pet, void | Error>({
        path: `/pet`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Add a new pet to the store.
     *
     * @tags pet
     * @name AddPet
     * @summary Add a new pet to the store.
     * @request POST:/pet
     * @secure
     */
    addPet: (data: Pet, params: RequestParams = {}) =>
      this.request<Pet, void | Error>({
        path: `/pet`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Multiple status values can be provided with comma separated strings.
     *
     * @tags pet
     * @name FindPetsByStatus
     * @summary Finds Pets by status.
     * @request GET:/pet/findByStatus
     * @secure
     */
    findPetsByStatus: (
      query?: {
        /**
         * Status values that need to be considered for filter
         * @default "available"
         */
        status?: "available" | "pending" | "sold";
      },
      params: RequestParams = {},
    ) =>
      this.request<Pet[], void | Error>({
        path: `/pet/findByStatus`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
     *
     * @tags pet
     * @name FindPetsByTags
     * @summary Finds Pets by tags.
     * @request GET:/pet/findByTags
     * @secure
     */
    findPetsByTags: (
      query?: {
        /** Tags to filter by */
        tags?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<Pet[], void | Error>({
        path: `/pet/findByTags`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Returns a single pet.
     *
     * @tags pet
     * @name GetPetById
     * @summary Find pet by ID.
     * @request GET:/pet/{petId}
     * @secure
     */
    getPetById: (petId: number, params: RequestParams = {}) =>
      this.request<Pet, void | Error>({
        path: `/pet/${petId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Updates a pet resource based on the form data.
     *
     * @tags pet
     * @name UpdatePetWithForm
     * @summary Updates a pet in the store with form data.
     * @request POST:/pet/{petId}
     * @secure
     */
    updatePetWithForm: (
      petId: number,
      query?: {
        /** Name of pet that needs to be updated */
        name?: string;
        /** Status of pet that needs to be updated */
        status?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Pet, void | Error>({
        path: `/pet/${petId}`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete a pet.
     *
     * @tags pet
     * @name DeletePet
     * @summary Deletes a pet.
     * @request DELETE:/pet/{petId}
     * @secure
     */
    deletePet: (petId: number, params: RequestParams = {}) =>
      this.request<void, void | Error>({
        path: `/pet/${petId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Upload image of the pet.
     *
     * @tags pet
     * @name UploadFile
     * @summary Uploads an image.
     * @request POST:/pet/{petId}/uploadImage
     * @secure
     */
    uploadFile: (
      petId: number,
      data: File,
      query?: {
        /** Additional Metadata */
        additionalMetadata?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiResponse, void | Error>({
        path: `/pet/${petId}/uploadImage`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  store = {
    /**
     * @description Returns a map of status codes to quantities.
     *
     * @tags store
     * @name GetInventory
     * @summary Returns pet inventories by status.
     * @request GET:/store/inventory
     * @secure
     */
    getInventory: (params: RequestParams = {}) =>
      this.request<Record<string, number>, Error>({
        path: `/store/inventory`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Place a new order in the store.
     *
     * @tags store
     * @name PlaceOrder
     * @summary Place an order for a pet.
     * @request POST:/store/order
     */
    placeOrder: (data: Order, params: RequestParams = {}) =>
      this.request<Order, void | Error>({
        path: `/store/order`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description For valid response try integer IDs with value <= 5 or > 10. Other values will generate exceptions.
     *
     * @tags store
     * @name GetOrderById
     * @summary Find purchase order by ID.
     * @request GET:/store/order/{orderId}
     */
    getOrderById: (orderId: number, params: RequestParams = {}) =>
      this.request<Order, void | Error>({
        path: `/store/order/${orderId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description For valid response try integer IDs with value < 1000. Anything above 1000 or nonintegers will generate API errors.
     *
     * @tags store
     * @name DeleteOrder
     * @summary Delete purchase order by identifier.
     * @request DELETE:/store/order/{orderId}
     */
    deleteOrder: (orderId: number, params: RequestParams = {}) =>
      this.request<void, void | Error>({
        path: `/store/order/${orderId}`,
        method: "DELETE",
        ...params,
      }),
  };
  user = {
    /**
     * @description This can only be done by the logged in user.
     *
     * @tags user
     * @name CreateUser
     * @summary Create user.
     * @request POST:/user
     */
    createUser: (data: User, params: RequestParams = {}) =>
      this.request<User, Error>({
        path: `/user`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Creates list of users with given input array.
     *
     * @tags user
     * @name CreateUsersWithListInput
     * @summary Creates list of users with given input array.
     * @request POST:/user/createWithList
     */
    createUsersWithListInput: (data: User[], params: RequestParams = {}) =>
      this.request<User, Error>({
        path: `/user/createWithList`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Log into the system.
     *
     * @tags user
     * @name LoginUser
     * @summary Logs user into the system.
     * @request GET:/user/login
     */
    loginUser: (
      query?: {
        /** The user name for login */
        username?: string;
        /** The password for login in clear text */
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, void | Error>({
        path: `/user/login`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Log user out of the system.
     *
     * @tags user
     * @name LogoutUser
     * @summary Logs out current logged in user session.
     * @request GET:/user/logout
     */
    logoutUser: (params: RequestParams = {}) =>
      this.request<void, Error>({
        path: `/user/logout`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Get user detail based on username.
     *
     * @tags user
     * @name GetUserByName
     * @summary Get user by user name.
     * @request GET:/user/{username}
     */
    getUserByName: (username: string, params: RequestParams = {}) =>
      this.request<User, void | Error>({
        path: `/user/${username}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description This can only be done by the logged in user.
     *
     * @tags user
     * @name UpdateUser
     * @summary Update user resource.
     * @request PUT:/user/{username}
     */
    updateUser: (username: string, data: User, params: RequestParams = {}) =>
      this.request<void, void | Error>({
        path: `/user/${username}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description This can only be done by the logged in user.
     *
     * @tags user
     * @name DeleteUser
     * @summary Delete user resource.
     * @request DELETE:/user/{username}
     */
    deleteUser: (username: string, params: RequestParams = {}) =>
      this.request<void, void | Error>({
        path: `/user/${username}`,
        method: "DELETE",
        ...params,
      }),
  };
}
