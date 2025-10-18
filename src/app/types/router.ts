export interface RouterContextType {
    navigateTo: (route: RoutePath) => void;
    pathname: string;
    isCurrentRoute: (route: RoutePath) => boolean;
}