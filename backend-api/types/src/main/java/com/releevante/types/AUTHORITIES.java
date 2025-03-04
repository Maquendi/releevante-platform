package com.releevante.types;

public enum AUTHORITIES {
  SUPER_ADMIN("SYSADMIN"),

  ADMIN("ADMIN"),

  CLIENT("CLIENT"),

  UI_WEB_ADMIN("UI-WEB-ADMIN"),

  UI_WEB_PUBLIC("UI-WEB-PUBLIC"),

  AGGREGATOR("AGGREGATOR");
  private final String authority;

  AUTHORITIES(String auth) {
    this.authority = auth;
  }

  public String getAuthority() {
    return authority;
  }

  public boolean isM2M() {
    return (UI_WEB_ADMIN == this) || (UI_WEB_PUBLIC == this);
  }
}
