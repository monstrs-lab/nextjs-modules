import type { RegistrationFlow }           from '@ory/client'
import type { VerificationFlow }           from '@ory/client'
import type { RecoveryFlow }               from '@ory/client'
import type { SettingsFlow }               from '@ory/client'
import type { LoginFlow }                  from '@ory/client'
import type { UpdateRegistrationFlowBody } from '@ory/client'
import type { UpdateVerificationFlowBody } from '@ory/client'
import type { UpdateRecoveryFlowBody }     from '@ory/client'
import type { UpdateSettingsFlowBody }     from '@ory/client'
import type { UpdateLoginFlowBody }        from '@ory/client'

export type FlowName =
  | 'errors'
  | 'login'
  | 'recovery'
  | 'registration'
  | 'settings'
  | 'verification'

export type Flow = LoginFlow | RecoveryFlow | RegistrationFlow | SettingsFlow | VerificationFlow

export type Body =
  | UpdateLoginFlowBody
  | UpdateRecoveryFlowBody
  | UpdateRegistrationFlowBody
  | UpdateSettingsFlowBody
  | UpdateVerificationFlowBody
