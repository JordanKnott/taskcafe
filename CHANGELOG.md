# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## UNRELEASED

### Added
- On login page, redirects to `/register` if no users exist (to help streamline initial setup)

### Fixed
- Fixes new user popup form so that it can now be submitted

## [0.3.5] - 2021-09-04

### Added
- Project visibility can now be set to public - meaning anyone can view the project board
- When redirected to login page while trying to view a page that requires login, you'll be redirected back to the correct page after login
- When creating a new label within the LabelManager on a card, the new label will automatically be applied to the task after creation

### Changed
- Switch primary font to Open Sans

### Fixed
- Any open popups are hidden when closing the Task Details window

## [0.1.1] - 2020-08-21

### Fixed
- fix panic(nil) when loading config if config file actually exists

## [0.1.0] - 2020-08-21

### Added
- first "stable" alpha release
