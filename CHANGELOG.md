## [v0.0.1-alpha.8](https://github.com/AdeAttwood/ReactForm/compare/v0.0.1-alpha.7...v0.0.1-alpha.8) (2023-04-26)

### Features

* export the dot notation functions ([53ca3f5](https://github.com/AdeAttwood/ReactForm/commit/53ca3f514a61aca7a6f2fdc0d971b258ba022f16))

## [v0.0.1-alpha.7](https://github.com/AdeAttwood/ReactForm/compare/v0.0.1-alpha.6...v0.0.1-alpha.7) (2023-04-01)

### Features

* expose validate, validateAttribute and setErrors to the context ([18f0610](https://github.com/AdeAttwood/ReactForm/commit/18f061001fe961ec846596490f1f0cfdbfcbfb71))

## [v0.0.1-alpha.6](https://github.com/AdeAttwood/ReactForm/compare/v0.0.1-alpha.5...v0.0.1-alpha.6) (2023-03-25)

### Bug Fixes

* add main prop to the package.json ([c92531c](https://github.com/AdeAttwood/ReactForm/commit/c92531ce1094299bcbbcec5c7bbf5ea04cc49f6d))


### Features

* add better generic support for useAttribute hook ([7682422](https://github.com/AdeAttwood/ReactForm/commit/7682422d2a64dcc7a965d9c36ffc73df0a46e937)), closes [#152](https://github.com/AdeAttwood/ReactForm/issues/152)
* allow null to be returned from a validation function ([bcdd9f3](https://github.com/AdeAttwood/ReactForm/commit/bcdd9f3ec112837dfbc35b918bed8bcd3bfba64c)), closes [#170](https://github.com/AdeAttwood/ReactForm/issues/170)
* pass the changed attribute though the onChange form callback ([e751896](https://github.com/AdeAttwood/ReactForm/commit/e751896e6d97c33c12ad87ec5c7fb052b051730e)), closes [#143](https://github.com/AdeAttwood/ReactForm/issues/143)

## [v0.0.1-alpha.5](https://github.com/AdeAttwood/ReactForm/compare/v0.0.1-alpha.4...v0.0.1-alpha.5) (2023-03-23)

### Bug Fixes

* export use attribute hooks ([996267f](https://github.com/AdeAttwood/ReactForm/commit/996267f1f73e9c36488c7d7bf1965b0f9fb3c742)), closes [#150](https://github.com/AdeAttwood/ReactForm/issues/150)
* use es5 syntax for the package build ([6a44b18](https://github.com/AdeAttwood/ReactForm/commit/6a44b18ea56afc6061e6a90d488f01a994c0a4c5)), closes [#149](https://github.com/AdeAttwood/ReactForm/issues/149)


### Features

* implement reorder on a list attribute ([acfee5e](https://github.com/AdeAttwood/ReactForm/commit/acfee5e48ff67e95dcc20bf07594b5ad3a31ed8b)), closes [#144](https://github.com/AdeAttwood/ReactForm/issues/144)

## [v0.0.1-alpha.4](https://github.com/AdeAttwood/ReactForm/compare/v0.0.1-alpha.3...v0.0.1-alpha.4) (2023-02-07)

### Features

* add `validator.clone()` function ([25dc286](https://github.com/AdeAttwood/ReactForm/commit/25dc28670eb4d0e206e1856db3495cebd4b4a6c9))
* allow a validation function to be async ([29e1125](https://github.com/AdeAttwood/ReactForm/commit/29e11257ca2309af757e52ea2dad3ef0a61e08de))
* allow errors to be passed in as props ([fce8f65](https://github.com/AdeAttwood/ReactForm/commit/fce8f65cafa2cf51934b1ef04b6b82c270af6c94))
* allow errors to be set from the onSubmit callback ([a745f3a](https://github.com/AdeAttwood/ReactForm/commit/a745f3a931fc313fa781ab61c98fd902cce4fc3b))
* pass the event to the onSubmit callback ([1550d48](https://github.com/AdeAttwood/ReactForm/commit/1550d4837bff74cfc1dd8f5f5a1817a584f69ace))
* split out the `OnSubmitFunction` type ([29176f4](https://github.com/AdeAttwood/ReactForm/commit/29176f4d3c62c08d493c50508b272d907d155d25))

## [v0.0.1-alpha.3](https://github.com/AdeAttwood/ReactForm/compare/v0.0.1-alpha.2...v0.0.1-alpha.3) (2023-01-20)

### Features

* add onChange prop ([b7c7cda](https://github.com/AdeAttwood/ReactForm/commit/b7c7cda8199311f648e985066347173286939c41)), closes [#94](https://github.com/AdeAttwood/ReactForm/issues/94)

## [v0.0.1-alpha.2](https://github.com/AdeAttwood/ReactForm/compare/v0.0.1-alpha.1...v0.0.1-alpha.2) (2022-12-21)

### Features

* add hooks for setting different attributes of different data types ([eaff039](https://github.com/AdeAttwood/ReactForm/commit/eaff0399e982fda174efb159bb73c6b44a67dd6a))
* implement remove list item ([0ff581c](https://github.com/AdeAttwood/ReactForm/commit/0ff581c9356a8b5eba98cba9dad9eaa9a9f9f07d)), closes [#38](https://github.com/AdeAttwood/ReactForm/issues/38)

## [v0.0.1-alpha.1](https://github.com/AdeAttwood/ReactForm/compare/v0.0.1-alpha.0...v0.0.1-alpha.1) (2022-11-19)

### Bug Fixes

* nested attribute errors ([47fba6d](https://github.com/AdeAttwood/ReactForm/commit/47fba6db0ca43729fcd200b90655fff50a5e87c1)), closes [#36](https://github.com/AdeAttwood/ReactForm/issues/36)
* remove dependency warnings when installing ([968762c](https://github.com/AdeAttwood/ReactForm/commit/968762c99a5af7a9c4febf60a76c91a39566a5ce)), closes [#20](https://github.com/AdeAttwood/ReactForm/issues/20)


### Features

* allow return type ValidationFunction to be undefined ([54a7aaa](https://github.com/AdeAttwood/ReactForm/commit/54a7aaaac0b579adbde2934e5530fc1bf80ebdc4)), closes [#40](https://github.com/AdeAttwood/ReactForm/issues/40)
* create more tests and add documentation for check group component ([cb1c4e0](https://github.com/AdeAttwood/ReactForm/commit/cb1c4e00b280a67dfda140d4f2bc5b064eb3b8f5)), closes [#37](https://github.com/AdeAttwood/ReactForm/issues/37)
* implement form status ([0d2a82a](https://github.com/AdeAttwood/ReactForm/commit/0d2a82ae812718c702ea05eedd1bb57f35b40ce2)), closes [#11](https://github.com/AdeAttwood/ReactForm/issues/11)

## v0.0.1-alpha.0 (2022-11-14)

### Bug Fixes

* export all components ([535926a](https://github.com/AdeAttwood/ReactForm/commit/535926abdd6d66fe8dd1fb5f9158e481d66d7576)), closes [#9](https://github.com/AdeAttwood/ReactForm/issues/9)


### Features

* add checkbox attribute ([c491cb7](https://github.com/AdeAttwood/ReactForm/commit/c491cb77941e5c38dab2a611b247b263a576c621))
* add list group inputs ([1f09904](https://github.com/AdeAttwood/ReactForm/commit/1f09904941b47bbd8f5d224ec70f5036c8d03bb2))
* add radio input ([39c38e5](https://github.com/AdeAttwood/ReactForm/commit/39c38e528f29cea2056d19defb107de41a76aa08))
* add select input component ([59872fa](https://github.com/AdeAttwood/ReactForm/commit/59872fa956c5c22965fb44eaf1bc9888dfc2f1d9))

