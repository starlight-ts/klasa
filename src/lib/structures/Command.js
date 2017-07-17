const ParsedUsage = require('../parsers/ParsedUsage');

/**
 * Base class for all Klasa Commands. See {@tutorial CreatingCommands} for more information how to use this class
 * to build custom commands.
 * @tutorial CreatingCommands
 */
class Command {

	/**
	 * @typedef {Object} CommandOptions
	 * @property {boolean} [enabled=true] Whether the command is enabled
	 * @property {Array<string>} [runIn=['text','dm','group']] What channel types the command should run in
	 * @property {number} [cooldown=0] The amount of time before the user can run the command again in seconds
	 * @property {Array<string>} [aliases=[]] Any comand aliases
	 * @property {number} [permLevel=0] The required permission level to use the command
	 * @property {Array<string>} [botPerms=[]] The required Discord permissions for the bot to use this command
	 * @property {Array<string>} [requiredSettings=[]] The required guild settings to use this command
	 * @property {string} [description=''] The help description for the command
	 * @property {string} [usage=''] The usage string for the command
	 * @property {?string} [usageDelim=undefined] The string to deliminate the command input for usage
	 * @property {string} [extendedHelp='No extended help available.'] Extended help strings
	 */

	/**
	 * @param {KlasaClient} client The Klasa Client
	 * @param {string} dir The path to the core or user command pieces folder
	 * @param {Array} file The path from the pieces folder to the command file
	 * @param {string} name The name of the command
	 * @param {CommandOptions} options Optional Command settings
	 */
	constructor(client, dir, file, name, {
		enabled = true,
		runIn = ['text', 'dm', 'group'],
		cooldown = 0,
		aliases = [],
		permLevel = 0,
		botPerms = [],
		requiredSettings = [],
		description = '',
		usage = '',
		usageDelim = undefined,
		extendedHelp = 'No extended help available.'
	}) {
		/**
		 * @type {KlasaClient}
		 */
		this.client = client;

		/**
		 * The type of Klasa piece this is
		 * @type {string}
		 */
		this.type = 'command';

		/**
		 * If the command is enabled or not
		 * @type {boolean}
		 */
		this.enabled = enabled;

		/**
		 * What channels the command should run in
		 * @type {Array<string>}
		 */
		this.runIn = runIn;

		/**
		 * The cooldown in seconds this command has
		 * @type {number}
		 */
		this.cooldown = cooldown;

		/**
		 * The aliases for this command
		 * @type {Array<string>}
		 */
		this.aliases = aliases;

		/**
		 * The required permLevel to run this command
		 * @type {number}
		 */
		this.permLevel = permLevel;

		/**
		 * The required bot permissions to run this command
		 * @type {Array<string>}
		 */
		this.botPerms = botPerms;

		/**
		 * The required guild settings to run this command
		 * @type {Array<string>}
		 */
		this.requiredSettings = requiredSettings;

		/**
		 * The name of the command
		 * @type {string}
		 */
		this.name = name;

		/**
		 * The description of the command
		 * @type {string}
		 */
		this.description = description;

		/**
		 * The extended help for the command
		 * @type {string}
		 */
		this.extendedHelp = extendedHelp;

		/**
		 * The usage string for the command
		 * @type {string}
		 */
		this.usageString = usage;

		/**
		 * The usage deliminator for the command input
		 * @type {string}
		 */
		this.usageDelim = usageDelim;

		/**
		 * The full category for the command
		 * @type {Array<string>}
		 */
		this.fullCategory = file;

		/**
		 * The main category for the command
		 * @type {string}
		 */
		this.category = file[0] || 'General';

		/**
		 * The sub category for the command
		 * @type {string}
		 */
		this.subCategory = file[1] || 'General';

		/**
		 * The parsed usage for the command
		 * @type {ParsedUsage}
		 */
		this.usage = new ParsedUsage(client, this);

		/**
		 * Any active cooldowns for the command
		 * @type {Map}
		 * @private
		 */
		this.cooldowns = new Map();

		/**
		 * The file location where this command is stored
		 * @type {Array<string>}
		 */
		this.file = file;

		/**
		 * The directory to where this command piece is stored
		 * @type {string}
		 */
		this.dir = dir;
	}

	/**
	 * Reloads this command
	 * @returns {Promise<Command>} The newly loaded command
	 */
	async reload() {
		const cmd = this.client.commands.load(this.dir, this.file);
		await cmd.init();
		return cmd;
	}

	/**
	 * Unloads this command
	 * @returns {void}
	 */
	unload() {
		return this.client.commands.delete(this);
	}

	/**
	 * Disables this command
	 * @returns {Command} This command
	 */
	disable() {
		this.enabled = false;
		return this;
	}

	/**
	 * Enables this command
	 * @returns {Command} This command
	 */
	enable() {
		this.enabled = true;
		return this;
	}

	/**
	 * The run method to be overwritten in actual commands
	 * @param {CommandMessage} msg The command message mapped on top of the message used to trigger this command
	 * @param {Array<any>} params The fully resolved parameters based on your usage / usageDelim
	 * @abstract
	 * @returns {Promise<Message>} You should return the response message whenever possible
	 */
	async run() {
		// Defined in extension Classes
	}

	/**
	 * The init method to be optionaly overwritten in actual commands
	 * @abstract
	 * @returns {Promise<void>}
	 */
	async init() {
		// Optionally defined in extension Classes
	}

}

module.exports = Command;
