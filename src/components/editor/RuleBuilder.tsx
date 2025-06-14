import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Code2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Rule {
  id: string;
  field: string;
  operator: string;
  value: string;
  logicalOperator?: 'AND' | 'OR';
}

interface RuleGroup {
  id: string;
  rules: Rule[];
  logicalOperator?: 'AND' | 'OR';
}

interface RuleBuilderProps {
  value: string;
  onChange: (value: string) => void;
  placeholders?: Array<{ label: string; field: string }>;
}

const operators = [
  { value: '==', label: 'equals' },
  { value: '!=', label: 'not equals' },
  { value: '>', label: 'greater than' },
  { value: '<', label: 'less than' },
  { value: '>=', label: 'greater than or equal' },
  { value: '<=', label: 'less than or equal' },
  { value: 'contains', label: 'contains' },
  { value: 'not_contains', label: 'does not contain' },
  { value: 'starts_with', label: 'starts with' },
  { value: 'ends_with', label: 'ends with' },
  { value: 'exists', label: 'exists' },
  { value: 'not_exists', label: 'does not exist' },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

const RuleBuilder: React.FC<RuleBuilderProps> = ({ value, onChange, placeholders = [] }) => {
  const [mode, setMode] = useState<'visual' | 'code'>('visual');
  const [ruleGroups, setRuleGroups] = useState<RuleGroup[]>([{
    id: generateId(),
    rules: [{
      id: generateId(),
      field: '',
      operator: '==',
      value: ''
    }]
  }]);
  const [rawCode, setRawCode] = useState(value || '');
  // Initialize from value
  useEffect(() => {
    try {
      if (value && mode === 'visual') {
        setRawCode(value);
      }
    } catch (error) {
      console.error('Error initializing RuleBuilder:', error);
    }
  }, [value, mode]);

  // Common user fields for rule building
  const commonFields = [
    { value: 'user.email', label: 'User Email' },
    { value: 'user.first_name', label: 'User First Name' },
    { value: 'user.last_name', label: 'User Last Name' },
    { value: 'user.is_premium', label: 'User Is Premium' },
    { value: 'user.subscription_status', label: 'Subscription Status' },
    { value: 'user.tags', label: 'User Tags' },
    { value: 'user.created_at', label: 'User Created Date' },
    { value: 'order.total', label: 'Order Total' },
    { value: 'order.status', label: 'Order Status' },
    { value: 'order.items_count', label: 'Order Items Count' },
    { value: 'account.type', label: 'Account Type' },
    { value: 'account.balance', label: 'Account Balance' },
    ...placeholders.map(p => ({ value: p.field, label: p.label }))
  ];

  const addRule = (groupId: string) => {
    setRuleGroups(groups => groups.map(group => 
      group.id === groupId 
        ? {
            ...group,
            rules: [
              ...group.rules,
              {
                id: generateId(),
                field: '',
                operator: '==',
                value: '',
                logicalOperator: 'AND'
              }
            ]
          }
        : group
    ));
  };

  const removeRule = (groupId: string, ruleId: string) => {
    setRuleGroups(groups => groups.map(group => 
      group.id === groupId 
        ? {
            ...group,
            rules: group.rules.filter(rule => rule.id !== ruleId)
          }
        : group
    ).filter(group => group.rules.length > 0));
  };

  const updateRule = (groupId: string, ruleId: string, updates: Partial<Rule>) => {
    setRuleGroups(groups => groups.map(group => 
      group.id === groupId 
        ? {
            ...group,
            rules: group.rules.map(rule => 
              rule.id === ruleId ? { ...rule, ...updates } : rule
            )
          }
        : group
    ));
  };

  const addRuleGroup = () => {
    setRuleGroups(groups => [
      ...groups,
      {
        id: generateId(),
        rules: [{
          id: generateId(),
          field: '',
          operator: '==',
          value: ''
        }],
        logicalOperator: 'OR'
      }
    ]);
  };

  const removeRuleGroup = (groupId: string) => {
    setRuleGroups(groups => groups.filter(group => group.id !== groupId));
  };

  const updateRuleGroup = (groupId: string, updates: Partial<RuleGroup>) => {
    setRuleGroups(groups => groups.map(group => 
      group.id === groupId ? { ...group, ...updates } : group
    ));
  };

  const generateLiquidCode = () => {
    if (!ruleGroups.length) return '';

    const groupConditions = ruleGroups.map(group => {
      if (!group.rules.length) return '';
      
      const ruleConditions = group.rules.map(rule => {
        if (!rule.field || !rule.operator) return '';
        
        let condition = '';
        const field = rule.field;
        const value = rule.value;
        
        switch (rule.operator) {
          case '==':
            condition = `${field} == "${value}"`;
            break;
          case '!=':
            condition = `${field} != "${value}"`;
            break;
          case '>':
            condition = `${field} > ${value}`;
            break;
          case '<':
            condition = `${field} < ${value}`;
            break;
          case '>=':
            condition = `${field} >= ${value}`;
            break;
          case '<=':
            condition = `${field} <= ${value}`;
            break;
          case 'contains':
            condition = `${field} contains "${value}"`;
            break;
          case 'not_contains':
            condition = `${field} contains "${value}" == false`;
            break;
          case 'starts_with':
            condition = `${field} contains "${value}"`;
            break;
          case 'ends_with':
            condition = `${field} contains "${value}"`;
            break;
          case 'exists':
            condition = `${field}`;
            break;
          case 'not_exists':
            condition = `${field} == blank`;
            break;
          default:
            condition = `${field} == "${value}"`;
        }
        
        return condition;
      }).filter(Boolean);

      if (ruleConditions.length === 0) return '';
      if (ruleConditions.length === 1) return ruleConditions[0];
      
      return `(${ruleConditions.join(' and ')})`;
    }).filter(Boolean);

    if (groupConditions.length === 0) return '';
    if (groupConditions.length === 1) return `{{ ${groupConditions[0]} }}`;
    
    return `{{ ${groupConditions.join(' or ')} }}`;
  };  useEffect(() => {
    try {
      if (mode === 'visual') {
        const code = generateLiquidCode();
        onChange(code);
      } else {
        onChange(rawCode);
      }
    } catch (error) {
      console.error('Error in RuleBuilder onChange:', error);
    }
  }, [ruleGroups, mode, rawCode]); // Removed onChange from dependencies to prevent infinite loop

  if (mode === 'code') {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="text-xs">Code Mode</Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setMode('visual')}
            className="text-xs h-7"
          >
            Switch to Visual
          </Button>
        </div>
        <Textarea
          value={rawCode}
          onChange={(e) => setRawCode(e.target.value)}
          placeholder="{{ user.is_premium and user.tags contains 'newsletter' }}"
          className="text-xs font-mono"
          rows={4}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="text-xs">Visual Mode</Badge>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setMode('code')}
          className="text-xs h-7"
        >
          <Code2 className="h-3 w-3 mr-1" />
          Switch to Code
        </Button>
      </div>

      {ruleGroups.map((group, groupIndex) => (
        <Card key={group.id} className="border border-muted">
          <CardContent className="p-3 space-y-2">
            {groupIndex > 0 && (
              <div className="flex justify-center">
                <Select 
                  value={group.logicalOperator || 'OR'} 
                  onValueChange={(value: 'AND' | 'OR') => updateRuleGroup(group.id, { logicalOperator: value })}
                >
                  <SelectTrigger className="w-20 h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {group.rules.map((rule, ruleIndex) => (
              <div key={rule.id} className="space-y-2">
                {ruleIndex > 0 && (
                  <div className="flex justify-center">
                    <Select 
                      value={rule.logicalOperator || 'AND'} 
                      onValueChange={(value: 'AND' | 'OR') => updateRule(group.id, rule.id, { logicalOperator: value })}
                    >
                      <SelectTrigger className="w-16 h-5 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-12 gap-2 items-center">
                  {/* Field */}
                  <div className="col-span-4">
                    <Select 
                      value={rule.field} 
                      onValueChange={(value) => updateRule(group.id, rule.id, { field: value })}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {commonFields.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Operator */}
                  <div className="col-span-3">
                    <Select 
                      value={rule.operator} 
                      onValueChange={(value) => updateRule(group.id, rule.id, { operator: value })}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Value */}
                  <div className="col-span-4">
                    {['exists', 'not_exists'].includes(rule.operator) ? (
                      <div className="h-7 flex items-center text-xs text-muted-foreground px-2">
                        No value needed
                      </div>
                    ) : (
                      <Input
                        value={rule.value}
                        onChange={(e) => updateRule(group.id, rule.id, { value: e.target.value })}
                        placeholder="Value"
                        className="h-7 text-xs"
                      />
                    )}
                  </div>

                  {/* Remove button */}
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRule(group.id, rule.id)}
                      className="h-7 w-7 p-0"
                      disabled={group.rules.length === 1 && ruleGroups.length === 1}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addRule(group.id)}
                className="text-xs h-6"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Rule
              </Button>

              {ruleGroups.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRuleGroup(group.id)}
                  className="text-xs h-6 text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove Group
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={addRuleGroup}
        className="w-full text-xs h-7"
      >
        <Plus className="h-3 w-3 mr-1" />
        Add Rule Group
      </Button>

      {ruleGroups.length > 0 && (
        <div className="text-xs text-muted-foreground p-2 bg-muted rounded border">
          <strong>Preview:</strong> {generateLiquidCode() || 'No conditions set'}
        </div>
      )}
    </div>
  );
};

export default RuleBuilder;
