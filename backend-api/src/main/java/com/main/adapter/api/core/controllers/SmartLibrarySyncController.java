package com.main.adapter.api.core.controllers;

import com.main.adapter.api.response.CustomApiResponse;
import com.main.application.core.SmartLibraryServiceFacade;
import com.releevante.core.application.dto.sl.SyncStatus;
import com.releevante.core.application.dto.sl.settings.LibrarySettingsDto;
import com.releevante.core.application.dto.sl.settings.PartialSettingDto;
import com.releevante.core.application.identity.dto.GrantedAccess;
import com.releevante.core.application.identity.dto.SmartLibraryAccessDto;
import com.releevante.core.application.identity.dto.UserAccessDto;
import com.releevante.core.application.identity.service.user.UserService;
import com.releevante.core.application.service.BookService;
import com.releevante.core.application.service.SettingService;
import com.releevante.core.domain.Book;
import com.releevante.core.domain.LibrarySetting;
import com.releevante.types.Slid;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/sl/{slid}")
public class SmartLibrarySyncController {
  private final SmartLibraryServiceFacade smartLibraryService;
  final BookService bookService;
  final UserService userService;

  final SettingService settingService;

  public SmartLibrarySyncController(
      SmartLibraryServiceFacade smartLibraryService,
      BookService bookService,
      UserService userService,
      SettingService settingService) {
    this.smartLibraryService = smartLibraryService;
    this.bookService = bookService;
    this.userService = userService;
    this.settingService = settingService;
  }

  @Operation(
      summary = "set library accesses synced",
      description = "all library accesses synchronized")
  @PreAuthorize("hasRole('AGGREGATOR')")
  @PutMapping("/accesses")
  public Mono<CustomApiResponse<Boolean>> setLibraryAccessesIsSynchronized(
      @PathVariable("slid") Slid slid) {
    return smartLibraryService.setAccessSynchronized(slid).map(CustomApiResponse::from);
  }

  @Operation(
      summary = "set library inventory synced",
      description = "library inventory is synchronized")
  @PreAuthorize("hasRole('AGGREGATOR')")
  @PutMapping("/inventories")
  public Mono<CustomApiResponse<Boolean>> setLibraryBooksSynchronized(
      @PathVariable("slid") Slid slid) {
    return smartLibraryService.setBooksSynchronized(slid).map(CustomApiResponse::from);
  }

  @PreAuthorize("hasRole('AGGREGATOR')")
  @PutMapping("/settings")
  public Mono<CustomApiResponse<Boolean>> setLibrarySettingsSynchronized(
      @PathVariable("slid") Slid slid) {
    return smartLibraryService.setLibrarySettingsSynchronized(slid).map(CustomApiResponse::from);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/settings/{id}")
  public Mono<CustomApiResponse<LibrarySetting>> patchSettings(
      @PathVariable("id") String settingId, @RequestBody PartialSettingDto setting) {
    return settingService.update(settingId, setting).map(CustomApiResponse::from);
  }

  @Operation(
      summary = "create smart library settings",
      description = "create the setting for the given smart library id")
  @PreAuthorize("hasRole('SYSADMIN')")
  @PostMapping("/settings")
  public Mono<CustomApiResponse<LibrarySetting>> createSettings(
      @RequestBody LibrarySettingsDto settings) {
    return settingService.create(settings).map(CustomApiResponse::from);
  }

  @Operation(summary = "get books by slid", description = "get a list of books in the system db")
  @PreAuthorize("hasRole('AGGREGATOR')")
  @GetMapping("/books")
  public Mono<CustomApiResponse<List<Book>>> getBooksBySlid(
      @PathVariable() String slid,
      @RequestParam() int page,
      @RequestParam() int size,
      @RequestParam() boolean includeTags,
      @RequestParam() boolean includeImages,
      @RequestParam(required = false) SyncStatus status) {

    return bookService
        .getBooks(Slid.of(slid), page, size, status, includeImages, includeTags)
        .collectList()
        .map(CustomApiResponse::from);
  }

  @PreAuthorize("hasRole('AGGREGATOR')")
  @PutMapping("/synchronized")
  public Mono<CustomApiResponse<Boolean>> setLibrarySynchronized(@PathVariable("slid") Slid slid) {
    return smartLibraryService.setSynchronized(slid).map(CustomApiResponse::from);
  }

  @PreAuthorize("hasAnyRole('AGGREGATOR', 'ADMIN')")
  @GetMapping("/settings")
  public Mono<CustomApiResponse<List<LibrarySetting>>> getSettings(
      @PathVariable() Slid slid, @RequestParam(required = false) SyncStatus status) {
    return Mono.justOrEmpty(status)
        .flatMap(
            syncStatus ->
                smartLibraryService.getSetting(slid, syncStatus.toBoolean()).collectList())
        .switchIfEmpty(smartLibraryService.getSetting(slid).collectList())
        .map(CustomApiResponse::from);
  }

  @PreAuthorize("hasRole('AGGREGATOR')")
  @GetMapping("/accesses")
  public Mono<CustomApiResponse<List<SmartLibraryAccessDto>>> getSmartLibraryAccesses(
      @PathVariable String slid, @RequestParam(required = false) SyncStatus status) {
    return Mono.justOrEmpty(status)
        .flatMap(
            syncStatus ->
                userService.getAccesses(Slid.of(slid), syncStatus.toBoolean()).collectList())
        .switchIfEmpty(userService.getAccesses(Slid.of(slid)).collectList())
        .map(CustomApiResponse::from);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/accesses")
  public Mono<CustomApiResponse<GrantedAccess>> createLibraryAccess(
      @PathVariable() Slid slid, @RequestBody UserAccessDto access) {
    return userService.create(slid, access).map(CustomApiResponse::from);
  }
}
