export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Secure Auth API",
    version: "0.1.0",
    description:
      "Authentication and authorization starter API. The interactive UI documents request and response shapes, but browser cookie behavior depends on your configured CORS origin."
  },
  servers: [{ url: "/api/v1", description: "Current server" }],
  tags: [
    { name: "System", description: "Operational endpoints" },
    { name: "Authentication", description: "Registration and session management" },
    { name: "Users", description: "Authenticated user data" },
    { name: "Administration", description: "Admin-only operations" }
  ],
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Get service health",
        responses: {
          "200": {
            description: "Service is running",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" }
              }
            }
          }
        }
      }
    },
    "/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Create an account",
        description:
          "Authentication routes are limited to 10 requests per 15-minute window per process/IP in the current configuration.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Account created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegistrationResponse" }
              }
            }
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "409": { $ref: "#/components/responses/EmailUnavailable" },
          "429": { $ref: "#/components/responses/RateLimited" },
          "503": { $ref: "#/components/responses/ServiceUnavailable" }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Log in",
        description:
          "Returns a short-lived Bearer access token and sets a 30-day HttpOnly refresh_token cookie.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Authenticated; refresh_token cookie is set",
            headers: {
              "Set-Cookie": {
                description:
                  "HttpOnly refresh_token; SameSite=Strict; Path=/api/v1/auth; Secure in production.",
                schema: { type: "string" }
              }
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthenticationResponse" }
              }
            }
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "401": { $ref: "#/components/responses/InvalidCredentials" },
          "429": { $ref: "#/components/responses/RateLimited" },
          "503": { $ref: "#/components/responses/ServiceUnavailable" }
        }
      }
    },
    "/auth/refresh": {
      post: {
        tags: ["Authentication"],
        summary: "Rotate a refresh session",
        description:
          "Consumes the refresh_token cookie, issues a new access token and cookie, and invalidates the old cookie. Replaying a consumed token revokes its full session family.",
        security: [{ refreshCookie: [] }],
        responses: {
          "200": {
            description: "Session rotated; a replacement refresh_token cookie is set",
            headers: {
              "Set-Cookie": {
                description: "Replacement HttpOnly refresh_token cookie.",
                schema: { type: "string" }
              }
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthenticationResponse" }
              }
            }
          },
          "401": {
            description: "Missing, invalid, expired, or replayed refresh token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RefreshErrorResponse" }
              }
            }
          },
          "429": { $ref: "#/components/responses/RateLimited" },
          "503": { $ref: "#/components/responses/ServiceUnavailable" }
        }
      }
    },
    "/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "Log out",
        description:
          "Revokes the current refresh session when present, clears the refresh_token cookie, and always returns no content.",
        security: [{ refreshCookie: [] }],
        responses: {
          "204": {
            description: "Refresh session revoked and cookie cleared",
            headers: {
              "Set-Cookie": {
                description: "Clears the refresh_token cookie.",
                schema: { type: "string" }
              }
            }
          },
          "429": { $ref: "#/components/responses/RateLimited" },
          "503": { $ref: "#/components/responses/ServiceUnavailable" }
        }
      }
    },
    "/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get the current user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user profile",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" }
              }
            }
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "503": { $ref: "#/components/responses/ServiceUnavailable" }
        }
      }
    },
    "/admin/users": {
      get: {
        tags: ["Administration"],
        summary: "List recent users",
        description:
          "Requires an access token carrying the admin role. Password hashes and refresh-token data are never returned.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Requested maximum. Values are clamped from 1 to 50; default is 20.",
            schema: { type: "integer", minimum: 1, maximum: 50, default: 20 }
          }
        ],
        responses: {
          "200": {
            description: "Recent users",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserListResponse" }
              }
            }
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "503": { $ref: "#/components/responses/ServiceUnavailable" }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      refreshCookie: {
        type: "apiKey",
        in: "cookie",
        name: "refresh_token",
        description:
          "Set automatically by login/refresh in a compatible same-origin browser session; never exposed in JSON."
      }
    },
    schemas: {
      RegisterRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", maxLength: 254, example: "vanessa@example.com" },
          password: {
            type: "string",
            format: "password",
            minLength: 12,
            maxLength: 72,
            description:
              "Must contain lowercase, uppercase, number, and symbol; must not include the email name.",
            example: "Tranquility!2026"
          },
          displayName: { type: "string", minLength: 1, maxLength: 80, example: "Vanessa" }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", maxLength: 254, example: "vanessa@example.com" },
          password: { type: "string", format: "password", minLength: 1, maxLength: 72 }
        }
      },
      User: {
        type: "object",
        required: ["id", "email", "role"],
        properties: {
          id: { type: "string", example: "66e1b5c9862c515d8dd2ad50" },
          email: { type: "string", format: "email", example: "vanessa@example.com" },
          displayName: { type: "string", nullable: true, example: "Vanessa" },
          role: { type: "string", enum: ["user", "staff", "admin"], example: "user" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      RegistrationResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            allOf: [
              { $ref: "#/components/schemas/User" },
              { type: "object", required: ["createdAt"] }
            ]
          }
        }
      },
      AuthenticationResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            type: "object",
            required: ["accessToken", "tokenType", "expiresInSeconds", "user", "refreshSessionExpiresAt"],
            properties: {
              accessToken: { type: "string", description: "15-minute signed JWT access token." },
              tokenType: { type: "string", enum: ["Bearer"] },
              expiresInSeconds: { type: "integer", example: 900 },
              user: { $ref: "#/components/schemas/User" },
              refreshSessionExpiresAt: { type: "string", format: "date-time" }
            }
          }
        }
      },
      UserResponse: {
        type: "object",
        required: ["data"],
        properties: { data: { $ref: "#/components/schemas/User" } }
      },
      UserListResponse: {
        type: "object",
        required: ["data", "meta"],
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/User" } },
          meta: {
            type: "object",
            required: ["limit"],
            properties: { limit: { type: "integer", example: 20 } }
          }
        }
      },
      HealthResponse: {
        type: "object",
        required: ["status", "service", "timestamp", "uptimeSeconds"],
        properties: {
          status: { type: "string", enum: ["ok"] },
          service: { type: "string", example: "secure-auth-api" },
          timestamp: { type: "string", format: "date-time" },
          uptimeSeconds: { type: "integer", minimum: 0 }
        }
      },
      ErrorResponse: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["code", "message"],
            properties: {
              code: { type: "string", example: "UNAUTHORIZED" },
              message: { type: "string" },
              fields: {
                type: "object",
                additionalProperties: { type: "array", items: { type: "string" } },
                description: "Present for registration validation failures."
              }
            }
          }
        }
      },
      RefreshErrorResponse: {
        allOf: [
          { $ref: "#/components/schemas/ErrorResponse" },
          {
            type: "object",
            properties: {
              error: {
                type: "object",
                properties: {
                  code: { type: "string", enum: ["INVALID_REFRESH_TOKEN", "REFRESH_TOKEN_REUSED"] }
                }
              }
            }
          }
        ]
      }
    },
    responses: {
      ValidationError: {
        description: "Request data failed validation",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
      },
      InvalidCredentials: {
        description: "Email or password is incorrect",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
      },
      Unauthorized: {
        description: "A valid access token is required",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
      },
      Forbidden: {
        description: "The token lacks the required role",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
      },
      EmailUnavailable: {
        description: "An account cannot be created with these details",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
      },
      RateLimited: {
        description: "Too many authentication attempts",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
      },
      ServiceUnavailable: {
        description: "Required database or JWT configuration is unavailable",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
      }
    }
  }
} as const;
