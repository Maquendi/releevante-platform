package com.releevante.types;

public enum AUTHORITIES {
  SUPER_ADMIN("SYSADMIN"),

  ADMIN("ADMIN");
  private final String authority;

  AUTHORITIES(String auth) {
    this.authority = auth;
  }

  public String getAuthority() {
    return authority;
  }
}
