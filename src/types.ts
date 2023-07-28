import type { FieldInfo, ParserOptions } from '@json2csv/plainjs'

export type { FieldInfo, ParserOptions }

/**
 * More info on Distributive Conditional Types: https://stackoverflow.com/a/57103940/11279811
 */
export type DistributiveOmit<T, K extends keyof T> = T extends T
	? Omit<T, K>
	: never

export enum FilterKeys {
	assetContainerId = '$assetContainerId',
	assetId = '$assetId',
	assetName = '$assetName',
	assetRegion = '$assetRegion',
	assetType = '$assetType',
	category = '$category',
	class = '$class',
	closedTime = '$closedTime',
	cloud = '$cloud',
	cluster = '$cluster',
	criticality = '$criticality',
	criticality_severity = 'criticality_severity',
	cveId = '$cveId',
	findingId = '$findingId',
	firstSeen = '$firstSeen',
	image = '$image',
	isProd = '$isProd',
	isCveExploitable = '$isCveExploitable',
	isCveTrending = '$isCveTrending',
	isPatchable = '$isPatchable',
	isSlaBreached = '$isSlaBreached',
	isTeamAssigned = '$isTeamAssigned',
	lastSeen = '$lastSeen',
	namespace = '$namespace',
	parentTeamName = '$parentTeamName',
	parentTeamId = '$parentTeamId',
	priority = '$priority',
	ruleId = '$ruleId',
	ruleName = '$ruleName',
	savedQueryForAsset = '$savedQueryForAsset',
	schema = '$schema',
	service = '$service',
	severity = '$severity',
	source = '$source',
	status = '$status',
	subclass = '$subclass',
	tags = '$tags',
	teamId = '$teamId',
	teamName = '$teamName',
	time = '$time'
}

// Onboarding step number enum used in web-orchestrator and web-onboarding
export enum OnboardingStepNum {
	endUserLicenseAgreement = 1,
	userName = 2,
	userWorkHours = 3,
	userPersona = 4,
	orgName = 5,
	orgManager = 6
}

export enum ModifierKeys {
	command = 'command',
	control = 'control',
	option = 'option',
	shift = 'shift'
}

export enum OperatingSystems {
	mac = 'mac',
	windows = 'windows'
}

export enum Services {
	appStore = 'appStore',
	billing = 'billing',
	detections = 'detections',
	findings = 'findings',
	integrations = 'integrations',
	notificationRules = 'notificationRules',
	onboarding = 'onboarding',
	orgManager = 'orgManager',
	preferences = 'preferences',
	profile = 'profile',
	query = 'query',
	visualize = 'visualize'
}

export interface KeyMapConfig {
	key: KeyboardEvent['key']
	label: string
}

export enum GlobalPreferenceKeys {
	mode = 'mode',
	theme = 'theme'
}

export enum StaticWidgetIds {
	execDashboardSlaBreaches = 'execDashboardSlaBreaches',
	execDashboardFindingsByClassification = 'execDashboardFindingsByClassification',
	execDashboardFindingsByPriority = 'execDashboardFindingsByPriority',
	execDashboardMttrByPriority = 'execDashboardMttrByPriority',
	execDashboardMttrByStatus = 'execDashboardMttrByStatus',
	findingsCategory = 'findingsCategory',
	findingsClassification = 'findingsClassification',
	findingsPriority = 'findingsPriority',
	findingsSources = 'findingsSources',
	findingsTable = 'findingsTable',
	queryTable = 'queryTable'
}

export enum QueryParams {
	forPDF = 'forPDF'
}
