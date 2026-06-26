% Force all workspace dependencies to be made explicit
% https://yarnpkg.com/features/constraints#force-all-workspace-dependencies-to-be-made-explicit
gen_enforced_dependency(WorkspaceCwd, DependencyIdent, 'workspace:*', DependencyType) :-
  workspace_ident(_, DependencyIdent),
  workspace_has_dependency(WorkspaceCwd, DependencyIdent, _, DependencyType).

% Enforce ESM - all packages must declare type: module
gen_enforced_field(WorkspaceCwd, 'type', 'module') :-
    WorkspaceCwd \= 'docusaurus'.

% Enforce minimum Node version
gen_enforced_field(WorkspaceCwd, 'engines.node', '>=22.0.0').
