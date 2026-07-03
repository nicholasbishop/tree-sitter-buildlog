import XCTest
import SwiftTreeSitter
import TreeSitterBuildlog

final class TreeSitterBuildlogTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_buildlog())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Build Log grammar")
    }
}
