const { generate: generateContentFile } = require('all-contributors-cli')

const AllContributorBotError = require('../utils/errors')

/*
 *  Fetches, stores, generates, and updates the readme content files for the contributors list
 */
class ContentFiles {
    constructor({ context, repository }) {
        this.context = context
        this.repository = repository
        this.contentFilesByPath = null
    }

    async fetch(optionsConfig) {
        const options = optionsConfig.get()
        if (Array.isArray(options.files)) {
            if (options.files.length > 5) {
                throw new AllContributorBotError(
                    `Your .all-contributorsrc cannot contain more than 5 files.`,
                )
            }

            this.contentFilesByPath = await this.repository.getMultipleFiles(
                options.files,
            )
        } else {
            this.contentFilesByPath = await this.repository.getMultipleFiles([
                'README.md',
            ])
        }
    }

    async generate(optionsConfig) {
        const options = optionsConfig.get()
        const newFilesByPath = {}
        debugger
        Object.entries(this.contentFilesByPath).forEach(
            ([filePath, { content, sha }]) => {
                const newFileContents = generateContentFile(
                    options,
                    options.contributors,
                    content,
                )
                newFilesByPath[filePath] = {
                    content: newFileContents,
                    originalSha: sha,
                }
            },
        )
        this.contentFilesByPath = newFilesByPath
    }

    get() {
        return this.contentFilesByPath
    }
}

module.exports = ContentFiles