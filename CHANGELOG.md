# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

<!--
"### Added" for new features.
"### Changed" for changes in existing functionality.
"### Deprecated" for soon-to-be removed features.
"### Removed" for now removed features.
"### Fixed" for any bug fixes.
"### Security" in case of vulnerabilities.
-->

## [2.2.1] - 2018-10-23

- Fix coordinates service unable to find bicycle routes

## [2.2.0] - 2018-10-18

- Added polygons array to the location POI object

## [2.1.3] - 2018-09-19

### Fixed

- Fix build problems in TS < 2.9 ([PR #8](https://github.com/digipolisantwerp/location-picker_service_nodejs/pull/8))

## [2.1.2] - 2018-09-04

### Fixed

- Added district field to coordinates response ([PR #7](https://github.com/digipolisantwerp/location-picker_service_nodejs/pull/7))

## [2.1.1] - 2018-08-23

### Fixed

- Stripped district from queries [#5](https://github.com/digipolisantwerp/location-picker_service_nodejs/issues/5) to solve issue [#3](https://github.com/digipolisantwerp/location-picker_widget_angular/issues/3) reported in UI.

## [2.1.0] - 2018-07-04

### Added

- added coordinates service to support planned leaflet picker widget [#4](https://github.com/digipolisantwerp/location-picker_service_nodejs/issues/4)

## [2.0.0] - 2018-06-25

### Changed

- remove coordinates field form response if result has no coordinates [#1](https://github.com/digipolisantwerp/location-picker_service_nodejs/issues/1)
- return SOLR id field instead of key field [#1](https://github.com/digipolisantwerp/location-picker_service_nodejs/issues/1)

## [1.1.0] - 2018-06-22

### Changed

- indicate district of streets in label (where possible) [location-picker_widget_angular#1](https://github.com/digipolisantwerp/location-picker_widget_angular/issues/1)

### Fixed

- fix missing results for "turnhoutsebaan 1" [location-picker_widget_angular#1](https://github.com/digipolisantwerp/location-picker_widget_angular/issues/1)

### Security

- fix security issue in build tools

## [1.0.1] - 2018-05-18

- Initial release.

[Unreleased]: https://github.com/digipolisantwerp/contact-picker_widget_angular/compare/v2.2.1...HEAD
[2.2.1]: https://github.com/digipolisantwerp/contact-picker_widget_angular/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/digipolisantwerp/contact-picker_widget_angular/compare/v2.1.3...v2.2.0
[2.1.3]: https://github.com/digipolisantwerp/contact-picker_widget_angular/compare/v2.1.2...v2.1.3
[2.1.2]: https://github.com/digipolisantwerp/contact-picker_widget_angular/compare/v2.1.1...v2.1.2
[2.1.1]: https://github.com/digipolisantwerp/contact-picker_widget_angular/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/digipolisantwerp/contact-picker_widget_angular/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/digipolisantwerp/contact-picker_widget_angular/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/digipolisantwerp/contact-picker_widget_angular/compare/v1.0.2...v1.1.0
[1.0.1]: https://github.com/digipolisantwerp/contact-picker_widget_angular/compare/v0.0.1...v1.0.1
