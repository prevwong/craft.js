# Contributing
Thank you for considering to contribute to Craft.js! 

From proofreading, translating, writing tutorials or blog posts, improving the documentation, submitting bug reports and feature requests, or writing code, there are many ways to contribute. Upon contribution as per the [all-contributors](https://allcontributors.org/) specification, your profile will be recognised in our README's contributors section.

To get started right away, have a look at our [project tracker](https://github.com/prevwong/craft.js/projects) to check out a list of things that we'd like to work on right now. 

If you are interested in proposing a new feature or have found a bug that you'd like to fix, please file a new [issue](https://github.com/prevwong/craft.js/issues).


# Setup
1. Fork this repository and create your branch from `master`
```bash
git clone https://github.com/your-name/craft.js
cd craft.js
```

2. Install the dependencies and start the development server
```bash
> yarn install
> yarn dev
```

3. Here are some additional npm scripts that might be useful
```bash
> yarn clean # clean all build files from all packages in the monorepo
> yarn build # create production build for all craftjs packages
> yarn lint # run tests across the monorepo 
```
4. Do your magic. :fireworks: Be sure that the package(s) that you're working on can still be successfully built after you've applied your changes.
5. Submit a [pull request](https://github.com/prevwong/craft.js/compare) to merge the changes from your fork :heart: **(If your PR is not linked to an existing issue, then be sure to explain what your PR aims to accomplish)**

## Pull requests

Craft.js uses [Changesets](https://github.com/changesets/changesets) to track and publish new releases.

Therefore, when you submit a change that affects functionality (ie: fix a bug or add a new feature) to one of the packages (in the `/packages/` folder), then you will need to create a new Changeset by running the following command:

```bash
yarn changeset
```

Typos and changes made to the `/examples` or the main `/site` do not require a changeset.

Currently Craft.js is still using major version 0.y.z, where y is only incremented when there's a major/breaking change. Hence, when creating a changeset:- 
- All backwards compatible changes and bug fixes should be labelled as a `patch` 
- Otherwise, it should be labelled as `minor`
- `major` should **not** be used at the moment


# License
By contributing, you agree that your contributions will be licensed under MIT License.

