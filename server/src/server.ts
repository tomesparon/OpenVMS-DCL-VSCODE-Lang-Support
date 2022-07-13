import {
	createConnection,
	TextDocuments,
	TextDocument,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams
} from 'vscode-languageserver';

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;
let hasDiagnosticRelatedInformationCapability: boolean = false;

connection.onInitialize((params: InitializeParams) => {
	let capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we will fall back using global settings
	hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
	hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
	hasDiagnosticRelatedInformationCapability =
		!!(capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation);

	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
			// Tell the client that the server supports code completion
			completionProvider: {
				resolveProvider: true
			}
		}
	};
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(
			DidChangeConfigurationNotification.type,
			undefined
		);
	}
	// if (hasWorkspaceFolderCapability) {
	// 	connection.workspace.onDidChangeWorkspaceFolders(_event => {
	// 		connection.console.log('Workspace folder change event received.');
	// 	});
	// }
});

// The settings
interface Settings {
	maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: Settings = { maxNumberOfProblems: 1000 };
let globalSettings: Settings = defaultSettings;

// Cache the settings of all open documents
let documentSettings: Map<string, Thenable<Settings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <Settings>(
			(change.settings.languageServerExample || defaultSettings)
		);
	}

	// Revalidate all open text documents
	// documents.all().forEach(validateTextDocument);
});

function getDocumentSettings(resource: string): Thenable<Settings> {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'languageServer'
		});
		documentSettings.set(resource, result);
	}
	return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});
//////////////////////////////////////////////////////////////////////////////////
// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
// documents.onDidChangeContent(change => {
// 	validateTextDocument(change.document);
// });

// async function validateTextDocument(textDocument: TextDocument): Promise<void> {
// 	// In this simple example we get the settings for every validate run.
// 	let settings = await getDocumentSettings(textDocument.uri);

// 	// The validator creates diagnostics for all uppercase words length 2 and more
// 	let text = textDocument.getText();
// 	let pattern = /\b[A-Z]{2,}\b/g;
// 	let m: RegExpExecArray | null;

// 	let problems = 0;
// 	let diagnostics: Diagnostic[] = [];
// 	while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
// 		problems++;
// 		let diagnosic: Diagnostic = {
// 			severity: DiagnosticSeverity.Warning,
// 			range: {
// 				start: textDocument.positionAt(m.index),
// 				end: textDocument.positionAt(m.index + m[0].length)
// 			},
// 			message: `${m[0]} is all uppercase.`,
// 			source: 'ex'
// 		};
// 		if (hasDiagnosticRelatedInformationCapability) {
// 			diagnosic.relatedInformation = [
// 				{
// 					location: {
// 						uri: textDocument.uri,
// 						range: Object.assign({}, diagnosic.range)
// 					},
// 					message: 'Spelling matters'
// 				},
// 				{
// 					location: {
// 						uri: textDocument.uri,
// 						range: Object.assign({}, diagnosic.range)
// 					},
// 					message: 'Particularly for names'
// 				}
// 			];
// 		}
// 		diagnostics.push(diagnosic);
// 	}

// 	// Send the computed diagnostics to VSCode.
// 	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
// }

// connection.onDidChangeWatchedFiles(_change => {
// 	// Monitored files have change in VSCode
// 	connection.console.log('We received an file change event');
// });

// This handler provides the initial list of the completion items.
connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		// The pass parameter contains the position of the text document in
		// which code complete got requested. For the example we ignore this
		// info and always provide the same completion items.
		return [
			{
				label: 'f$environment',
				kind: CompletionItemKind.Text,
				data: 1
			},
			{
				label: 'f$search',
				kind: CompletionItemKind.Text,
				data: 2
			},
			{
				label: 'f$integer',
				kind: CompletionItemKind.Text,
				data: 3
			},
			{
				label: 'f$context',
				kind: CompletionItemKind.Text,
				data: 4
			},
			{
				label: 'f$csid',
				kind: CompletionItemKind.Text,
				data: 5
			},
			{
				label: 'f$cvsi',
				kind: CompletionItemKind.Text,
				data: 6
			},
			{
				label: 'f$cvtime',
				kind: CompletionItemKind.Text,
				data: 7
			},
			{
				label: 'f$cvui',
				kind: CompletionItemKind.Text,
				data: 8
			},
			{
				label: 'f$device',
				kind: CompletionItemKind.Text,
				data: 9
			},
			{
				label: 'f$directory',
				kind: CompletionItemKind.Text,
				data: 10
			},
			{
				label: 'f$edit',
				kind: CompletionItemKind.Text,
				data: 11
			},
			{
				label: 'f$element',
				kind: CompletionItemKind.Text,
				data: 12
			},
			{
				label: 'f$extract',
				kind: CompletionItemKind.Text,
				data: 13
			},
			{
				label: 'f$fao',
				kind: CompletionItemKind.Text,
				data: 14
			},
			{
				label: 'f$file_attributes',
				kind: CompletionItemKind.Text,
				data: 15
			},
			{
				label: 'f$getdvi',
				kind: CompletionItemKind.Text,
				data: 16
			},
			{
				label: 'f$getjpi',
				kind: CompletionItemKind.Text,
				data: 17
			},
			{
				label: 'f$getqui',
				kind: CompletionItemKind.Text,
				data: 18
			},
			{
				label: 'f$getsyi',
				kind: CompletionItemKind.Text,
				data: 19
			},
			{
				label: 'f$identifier',
				kind: CompletionItemKind.Text,
				data: 20
			},
			{
				label: 'f$length',
				kind: CompletionItemKind.Text,
				data: 21
			},
			{
				label: 'f$locate',
				kind: CompletionItemKind.Text,
				data: 22
			},
			{
				label: 'f$message',
				kind: CompletionItemKind.Text,
				data: 23
			},
			{
				label: 'f$mode',
				kind: CompletionItemKind.Text,
				data: 24
			},
			{
				label: 'f$parse',
				kind: CompletionItemKind.Text,
				data: 25
			},
			{
				label: 'f$pid',
				kind: CompletionItemKind.Text,
				data: 26
			},
			{
				label: 'f$privilege',
				kind: CompletionItemKind.Text,
				data: 27
			},
			{
				label: 'f$process',
				kind: CompletionItemKind.Text,
				data: 28
			},
			{
				label: 'f$setprv',
				kind: CompletionItemKind.Text,
				data: 29
			},
			{
				label: 'f$string',
				kind: CompletionItemKind.Text,
				data: 30
			},
			{
				label: 'f$time',
				kind: CompletionItemKind.Text,
				data: 31
			},
			{
				label: 'f$trnlnm',
				kind: CompletionItemKind.Text,
				data: 32
			},
			{
				label: 'f$type',
				kind: CompletionItemKind.Text,
				data: 33
			},
			{
				label: 'f$user',
				kind: CompletionItemKind.Text,
				data: 34
			},
			{
				label: 'f$verify',
				kind: CompletionItemKind.Text,
				data: 35
			},
			// VMS COMMANDS
			{
				label: 'DIRECTORY',
				kind: CompletionItemKind.Text,
				data: 36
			},
			{
				label: 'SET DEFAULT',
				kind: CompletionItemKind.Text,
				data: 37
			},
			{
				label: 'SHOW DEFAULT',
				kind: CompletionItemKind.Text,
				data: 38
			},
			{
				label: 'CREATE/DIR',
				kind: CompletionItemKind.Text,
				data: 39
			},
			{
				label: 'DELETE/DIR',
				kind: CompletionItemKind.Text,
				data: 40
			},
			{
				label: 'SHOW QUOTA',
				kind: CompletionItemKind.Text,
				data: 41
			},
			{
				label: 'COPY',
				kind: CompletionItemKind.Text,
				data: 42
			},
			{
				label: 'RENAME',
				kind: CompletionItemKind.Text,
				data: 43
			},
			{
				label: 'PURGE',
				kind: CompletionItemKind.Text,
				data: 44
			},
			{
				label: 'DELETE',
				kind: CompletionItemKind.Text,
				data: 45
			},
			{
				label: 'TYPE',
				kind: CompletionItemKind.Text,
				data: 46
			},
			{
				label: 'SORT',
				kind: CompletionItemKind.Text,
				data: 47
			},
			{
				label: 'DIFF',
				kind: CompletionItemKind.Text,
				data: 48
			},
			{
				label: 'SHOW PROTECTION',
				kind: CompletionItemKind.Text,
				data: 49
			},
			{
				label: 'PRINT',
				kind: CompletionItemKind.Text,
				data: 50
			},
			{
				label: 'LASER',
				kind: CompletionItemKind.Text,
				data: 51
			},
			{
				label: 'SHOW QUEUE',
				kind: CompletionItemKind.Text,
				data: 52
			},
			{
				label: 'SUBMIT',
				kind: CompletionItemKind.Text,
				data: 53
			},
			{
				label: 'SHOW',
				kind: CompletionItemKind.Text,
				data: 54
			},
			{
				label: 'SHOW SYMBOL',
				kind: CompletionItemKind.Text,
				data: 55
			},
			{
				label: 'SHOW LOGICAL',
				kind: CompletionItemKind.Text,
				data: 56
			},
			{
				label: 'SEARCH',
				kind: CompletionItemKind.Text,
				data: 57
			},
			{
				label: 'STOP',
				kind: CompletionItemKind.Text,
				data: 58
			},
			{
				label: 'SHOW PROC/PRIV',
				kind: CompletionItemKind.Text,
				data: 59
			},
			{
				label: 'PIPE',
				kind: CompletionItemKind.Text,
				data: 60
			},
			{
				label: 'SET',
				kind: CompletionItemKind.Text,
				data: 61
			}
			
		];
	}
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {

		switch (item.data){
			case 1 : {
				// f$environment
				(item.detail = 'Lexical'),
				(item.documentation = 'Returns information about the current DCL command environment.');
				break;
			}
			case 2 : {
				// f$search
				(item.detail = 'Lexical'),
				(item.documentation = 'Searches a directory file and returns the full file specification for a file you specify');
				break;
			}
			case 3 : {
				// f$integer
				(item.detail = 'Lexical'),
				(item.documentation = 'Returns the integer equivalent of the result of the specified expression');
				break;
			}
			case 4 : {
				// f$context
				(item.detail = 'Lexical'),
				(item.documentation = 
					'Specifies selection criteria for use with the F$PID function.\
						The F$CONTEXT function enables the F$PID function to obtain\
					 information about processes from any node in an OpenVMS Cluster\
					system.');
				break;
			}
			case 5 : {
				// f$csid
				(item.detail = 'Lexical'),
				(item.documentation = 'Returns an identification number from an OpenVMS Cluster system\
				and updates the context symbol to point to the current position\
				in the system\'s cluster node list.');
				break;
			}
			case 6 : {
				// f$cvsi
				(item.detail = 'Lexical'),
				(item.documentation = 'Converts the specified bits in the specified character string to	a signed number');
				break;
			}
			case 7 : {
				// f$cvtime
				(item.detail = 'Lexical'),
				(item.documentation = 'Converts absolute or a combination time string to a string of\
										the form yyyy-mm-dd hh:mm:ss.cc. The F$CVTIME function can also\
											return information about absolute, combination, or delta time string.');
				break;
			}
			case 8 : {
				// f$cvui
				(item.detail = 'Lexical'),
				(item.documentation = 'Extracts bit fields from character string data and converts the	result to an unsigned number.');
				break;
			}
			case 9 : {
				// f$device
				(item.detail = 'Lexical'),
				(item.documentation = 'Returns the device names of all devices on a system that meet the\
										specified selection criteria.');
				break;
			}
			case 10 : {
				//f$directory
				(item.detail = 'Lexical'),
				(item.documentation = 'Returns the current default directory name string. The\
										F$DIRECTORY function has no arguments, but must be followed by\
										parentheses.');
				break;
			}
			case 11 : {
				// f$edit
				(item.detail = 'Lexical'),
				(item.documentation = 'Edits the character string based on the edits specified in the\
										edit-list argument.');
				break;
			}
			case 12 : {
				// f$element
				(item.detail = 'Lexical'),
				(item.documentation = ' Extracts one element from a string of elements.');
				break;
			}
			case 13 : {
				// f$extract
				(item.detail = 'Lexical'),
				(item.documentation = 'Extracts the specified characters from the specified string.');
				break;
			}
			case 14 : {
				// f$fao
				(item.detail = 'Lexical'),
				(item.documentation = ' Converts character and numeric input to ASCII character strings.\
										(FAO stands for formatted ASCII output.) By specifying formatting\
										instructions, you can use the F$FAO function to convert integer\
										values to character strings, to insert carriage returns and form\
										feeds, to insert text, and so on.');
				break;
			}
			case 15 : {
				// f$file attri
				(item.detail = 'Lexical'),
				(item.documentation = 'Returns attribute information for a specified file.');
				break;
			}
			case 16 : {
				// f$getdvi
				(item.detail = 'Lexical'),
				(item.documentation = ' Returns a specified item of information for a specified device.');
				break;
			}
			case 17 : {
				// f$getjpi
				(item.detail = 'Lexical'),
				(item.documentation = '  Returns information about the specified process.');
				break;
			}
			case 18 : {
				// F$GETQUI
				(item.detail = 'Lexical'),
				(item.documentation = 'Returns information about queues, including batch and print jobs\
										currently in the queues, form definitions, and characteristic\
											definitions kept in the queue database.');
				break;
			}
			case 19 : {
				// F$GETSYI
				(item.detail = 'Lexical'),
				(item.documentation = 'Returns status and identification information about the local\
										system (or about a node in the local dual-architecture OpenVMS\
										Cluster system, if your system is part of an OpenVMS Cluster).');
				break;
			}
			case 20 : {
				// F$IDENTIFIER
				(item.detail = 'Lexical'),
				(item.documentation = 'Converts an alphanumeric identifier to its integer equivalent\
										or converts an integer identifier to its alphanumeric equivalent.\
										An identifier is a name or number that identifies a category of\
										users. The system uses identifiers to determine a users access\
										to a resource.');
				break;
			}
			case 21 : {
				// f$length
				(item.detail = 'Lexical'),
				(item.documentation = 'Returns the length of the specified character string.');
				break;
			}
			case 22 : {
				// F$LOCATE
				(item.detail = 'Lexical'),
				(item.documentation = '   Locates a specified portion of a character string and returns as\
											an integer the offset of the first character. (An offset is the\
											position of a character or a substring relative to the begining\
											of the string. The first character in a string is always offset\
											position 0 from the beginning of the string.) If the substring\
											is not found, F$LOCATE returns the length (the offset of the\
											last character in the character string plus one) of the searched\
											string.');
				break;
			}
			case 23 : {
				// F$MESSAGE
				(item.detail = 'Lexical'),
				(item.documentation = ' Returns as a character string the facility, severity,\
										identification, and text associated with the specified systemstatus code.');
				break;
			}
			case 24 : {
				// f$mode
				(item.detail = 'Lexical'),
				(item.documentation = '   Returns a character string showing the mode in which a process\
											is executing. The F$MODE function has no arguments, but must be\
											followed by parentheses.');
				break;
			}
			case 25 : {
				// f$parse
				(item.detail = 'Lexical'),
				(item.documentation = '  Parses a file specification and returns either the expanded file\
										specification or the particular file specification field that you request');
				break;
			}
			case 26 : {
				// F$PID
				(item.detail = 'Lexical'),
				(item.documentation = 'Returns a process identification (PID) number and updates the\
										context symbol to point to the current position in the systems\
										process list. ');
				break;
			}
			case 27 : {
				// F$PRIVILEGE
				(item.detail = 'Lexical'),
				(item.documentation = ' Returns a string value of either TRUE or FALSE, depending on\
										whether your current process privileges match those specified\
										in the argument. You can specify either the positive or negative\
										version of a privilege.');
				break;
			}
			case 28 : {
				// F$PROCESS
				(item.detail = 'Lexical'),
				(item.documentation = 'Obtains the current process name string. The F$PROCESS function\
										has no arguments, but must be followed by parentheses.');
				break;
			}
			case 29 : {
				// F$SETPRV
				(item.detail = 'Lexical'),
				(item.documentation = 'Enables or disables specified user privileges. The F$SETPRV\
										function returns a list of keywords indicating user privileges;\
										this list shows the status of the specified privileges before\
										F$SETPRV was executed.');
				break;
			}
			case 30 : {
				// F$STRING
				(item.detail = 'Lexical'),
				(item.documentation = ' Returns the string that is equivalent to the specified expression.');
				break;
			}
			case 31 : {
				//  F$TIME
				(item.detail = 'Lexical'),
				(item.documentation = ' Returns the current date and time in absolute time format.');
				break;
			}
			case 32 : {
				// F$TRNLNM
				(item.detail = 'Lexical'),
				(item.documentation = 'Translates a logical name and returns the equivalence name string\
										or the requested attributes of the logical name specified.');
				break;
			}
			case 33 : {
				// F$TYPE
				(item.detail = 'Lexical'),
				(item.documentation = '   Returns the data type of a symbol. The string INTEGER is returned\
											if the symbol is equated to an integer, or if the symbol is\
											equated to a string whose characters form a valid integer.');
				break;
			}
			case 34 : {
				// f$USER
				(item.detail = 'Lexical'),
				(item.documentation = '  Returns the current user identification code (UIC) in named\
											format as a character string. The F$USER function has no\
											arguments, but must be followed by parentheses.');
				break;
			}
			case 35 : {
				// F$VERIFY
				(item.detail = 'Lexical'),
				(item.documentation = '  Returns an integer value indicating whether the procedure\
										verification setting is currently on or off. If used with\
										arguments, the F$VERIFY function can turn the procedure and image\
										verification settings on or off. You must include the parentheses\
										after the F$VERIFY function whether or not you specify arguments.');
				break;
			}
			case 36 : {
				// DIRECTORY
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'List directory contents');
				break;
			}
			case 37 : {
				// SET DEFAULT
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Change directory to dirname');
				break;
			}
			case 38 : {
				// SHOW DEFAULT
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Print current directory pathname');
				break;
			}
			case 39 : {
				// CREATE/DIR
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Create subdirectory');
				break;
			}
			case 40 : {
				// DELETE/DIR
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Delete subdirectory');
				break;
			}
			case 41 : {
				// SHOW QUOTA
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Display your disk quota');
				break;
			}
			case 42 : {
				// COPY
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Copy file contents from file1 to file2');
				break;
			}
			case 43 : {
				// RENAME
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Move contents of file1 to file2');
				break;
			}
			case 44 : {
				// PURGE
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Delete copies of file1 except for the most recent');
				break;
			}
			case 45 : {
				// DELETE
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Delete <file1>, version number (;<*>) must be specified');
				break;
			}
			case 46 : {
				// TYPE
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Print contents of file1 to screen');
				break;
			}
			case 47 : {
				// SORT
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Sort file1 into file2 - if file2 is not specified, command will create another version of file1');
				break;
			}
			case 48 : {
				// DIFF
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Compares text files and displays difference');
				break;
			}
			case 49 : {
				// SHOW PROTECTION
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Show permissions on files');
				break;
			}
			case 50 : {
				// PRINT
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Print a file');
				break;
			}
			case 51 : {
				// LASER
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Print PostScript file (assumes .lsr extension)');
				break;
			}
			case 52 : {
				// SHOW QUEUE
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Display printer queue');
				break;
			}
			case 53 : {
				// SUBMIT
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Submit file1 to batch queue');
				break;
			}
			case 54 : {
				// SHOW
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Show <eg process>');
				break;
			}
			case 55 : {
				// SHOW SYMBOL
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Show symbol assignment');
				break;
			}
			case 56 : {
				// SHOW LOGICAL
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Show logical name assignment');
				break;
			}
			case 57 : {
				// SEARCH
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Search for string in file. eg Search filename "hi there"');
				break;
			}
			case 58 : {
				// STOP
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Kill something eg process');
				break;
			}
			case 59 : {
				// SHOW PROC/PRIV
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'display your privileges');
				break;
			}
			case 60 : {
				// PIPE
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Pipes enable your application to receive input from any OpenVMS command that writes to SYS$OUTPUT');
				break;
			}
			case 61 : {
				// SET
				(item.detail = 'VMS COMMAND'),
				(item.documentation = 'Change a setting');
				break;
			}
			// THE END!!
			default : {
				break;
			}
			
		}
		return item;
	}
);

/* UNUSED CONNECTION METHODS
connection.onDidOpenTextDocument((params) => {
	// A text document got opened in VSCode.
	// params.uri uniquely identifies the document. For documents store on disk this is a file URI.
	// params.text the initial full content of the document.
	connection.console.log(`${params.textDocument.uri} opened.`);
});
connection.onDidChangeTextDocument((params) => {
	// The content of a text document did change in VSCode.
	// params.uri uniquely identifies the document.
	// params.contentChanges describe the content changes to the document.
	connection.console.log(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
});
connection.onDidCloseTextDocument((params) => {
	// A text document got closed in VSCode.
	// params.uri uniquely identifies the document.
	connection.console.log(`${params.textDocument.uri} closed.`);
});
*/

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
