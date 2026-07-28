export enum Role{
  EMPLOYE='EMPLOYE',
  RESPONSABLE_RH= 'RESPONSABLE_RH',
  EXTERNAL_COMPANY='EXTERNAL_COMPANY',
  ADMIN='ADMIN',
}
export const ROLE_LABLES:Record<Role, string> = {
  [Role.EMPLOYE]: 'EMPLOYE',
  [Role.RESPONSABLE_RH]:'RH MANGER',
  [Role.EXTERNAL_COMPANY]:'Enterprise Ext',
  [Role.ADMIN]:'Admin',
};
export const ROLE_HOME_ROUTE:Record<Role, string> = {
  [Role.EMPLOYE]:'/employee/dashboard',
  [Role.RESPONSABLE_RH]:'/rh/dashboard',
  [Role.EXTERNAL_COMPANY]:'/external/dashboard',
  [Role.ADMIN]:'/admin/dashboard',
};
export const ROLE_REGISTER_ENDPOINT: Partial<Record<Role, 'EMPLOYES'|'RESPONSABLES_RH'|'EXTERNAL_COMPANIES'>> = {
  [Role.EMPLOYE]:'EMPLOYES',
  [Role.RESPONSABLE_RH]:'RESPONSABLES_RH',
  [Role.EXTERNAL_COMPANY]:'EXTERNAL_COMPANIES'
};
