% Force all workspace dependencies to be made explicit
% https://yarnpkg.com/features/constraints#force-all-workspace-dependencies-to-be-made-explicit
gen_enforced_dependency(WorkspaceCwd, DependencyIdent, 'workspace:*', DependencyType) :-
  workspace_ident(_, DependencyIdent),
  workspace_has_dependency(WorkspaceCwd, DependencyIdent, _, DependencyType).

% Prevent two workspaces from depending on conflicting versions on the same dependency
% This is useful for avoiding resolution bugs when multiple workspaces of the same package are installed
gen_enforced_dependency(WorkspaceCwd, DependencyIdent, DependencyRange2, DependencyType) :-
  workspace_has_dependency(WorkspaceCwd, DependencyIdent, DependencyRange, DependencyType),
  workspace_has_dependency(OtherWorkspaceCwd, DependencyIdent, DependencyRange2, DependencyType2),
  DependencyRange \= DependencyRange2.

gen_enforced_dependency(WorkspaceCwd, 'lodash', '^4.17.21', DependencyType) :-
  workspace_has_dependency(WorkspaceCwd, 'lodash', _, DependencyType).
